"""Routes for dealing with users and authentication"""
import os
import json
import uuid

from flask import jsonify, request, session, current_app

from flask_login import login_required, login_user, logout_user, current_user
from flask_principal import identity_changed, AnonymousIdentity, Identity
from flask_restless.helpers import to_dict

from werkzeug.exceptions import NotFound, Conflict

from app import App, DB, Admin_permission

from app.types import User, Role

from app.routes.util import fetch_entity

def user_dict(user):
    """Turn a User object into a dictionary suitable for serialization"""
    data = to_dict(user)
    del data['password_crypt']
    if Admin_permission.can() or user.user_id == current_user.user_id:
        data['roles'] = [r.name for r in user.roles]
    return data

@App.route('/user', methods=['GET'])
@login_required
@Admin_permission.require(403)
def get_users():
    """Get a list of users"""
    return jsonify(users=[user_dict(u) for u in User.query.order_by(User.user_id.asc()).all()])

@App.route('/role', methods=['GET'])
@login_required
@Admin_permission.require(403)
def get_roles():
    """Get a list of roles"""
    return jsonify(roles=[to_dict(r) for r in Role.query.all()])

@App.route('/user/current', methods=['PUT'])
def update_current_user():
    """Update the current user's data"""
    # pylint: disable=unexpected-keyword-arg, no-value-for-parameter
    # pylint doesn't understand the argument name magic that happens with @fetch_entity
    return update_user(user_id=current_user.user_id)

@App.route('/user/<user_id>', methods=['PUT'])
@login_required
@fetch_entity(User, 'user')
def update_user(user):
    """Update a user's data"""
    if user.user_id != current_user.user_id:
        Admin_permission.test(403)
    input_data = json.loads(request.data)
    if Admin_permission.can() and 'roles' in input_data:
        for role in user.roles:
            if role.name in input_data['roles']:
                input_data['roles'].remove(role.name)
            else:
                user.roles.remove(role)
        for role_name in input_data['roles']:
            role = Role.query.filter_by(name=role_name).first()
            if role is not None:
                user.roles.append(role)
    DB.session.commit()
    return jsonify(user_dict(user))

@App.route('/user/current', methods=['GET'])
@login_required
def get_current_user():
    """Get information about the current logged in user"""
    # pylint: disable=unexpected-keyword-arg, no-value-for-parameter
    # pylint doesn't understand the argument name magic that happens with @fetch_entity
    return get_user(user_id=current_user.user_id)

@App.route('/user/<user_id>', methods=['GET'])
@login_required
@fetch_entity(User, 'user')
def get_user(user):
    """Get information about a particular user"""
    return jsonify(user_dict(user))

@App.route('/login', methods=['PUT'])
def login():
    """Check credentials and login a user"""
    input_data = json.loads(request.data)
    user = User.query.filter_by(username=input_data['username']).first()
    if user and not user.verify_password(input_data['password']):
        user = None
    if user is not None:
        login_user(user)
        identity_changed.send(current_app._get_current_object(), identity=Identity(user.user_id))
        return '', 200
    else:
        return 'Invalid login', 401

@App.route('/logout', methods=['PUT'])
@login_required
def logout():
    """Logout the user"""
    logout_user()
    for key in ('identity.name', 'identity.auth_type'):
        session.pop(key, None)
    identity_changed.send(
        current_app._get_current_object(), identity=AnonymousIdentity()
    )
    return '', 200

@App.route('/user', methods=['POST'])
@login_required
@Admin_permission.require(403)
def register():
    """Register a new user"""
    user_data = json.loads(request.data)
    user = User.query.filter_by(username=user_data['username']).first()
    if user is not None:
        raise Conflict('Duplicate username')
    user = User.query.filter_by(email=user_data['email']).first()
    if user is not None:
        return 'Duplicate email', 409
    password = user_data['password']
    user_data.pop('password', None)
    new_user = User(
        username=user_data['username'],
        email=user_data['email'],
    )
    new_user.crypt_password(password)
    DB.session.add(new_user)
    DB.session.commit()
    return jsonify(user_dict(new_user))
