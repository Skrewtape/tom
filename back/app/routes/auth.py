"""Routes for dealing with users and authentication"""
import os
import json
import uuid

from flask import jsonify, request, session, current_app, abort

from flask_login import login_required, login_user, logout_user, current_user
from flask_principal import identity_changed, AnonymousIdentity, Identity
from flask_restless.helpers import to_dict

from werkzeug.exceptions import Conflict,Unauthorized

from app import App, DB, Admin_permission

from app.types import User, Role

from app.routes.util import fetch_entity

from sqlalchemy.exc import ArgumentError,InvalidRequestError,IntegrityError
import time

@App.route('/user', methods=['GET'])
@login_required
@Admin_permission.require(403)
def get_users():
    """Get a list of users"""    
    return jsonify(users=[u.to_dict_simple() for u in User.query.order_by(User.user_id.asc()).all()])

@App.route('/role', methods=['GET'])
@login_required
@Admin_permission.require(403)
def get_roles():
    """Get a list of roles"""
    #return jsonify(roles=[r.to_dict_simple() for r in Role.query.all()])
    return jsonify({r.role_id:r.to_dict_simple() for r in Role.query.all()})

@App.route('/user/current', methods=['PUT'])
def update_current_user():
    """Update the current user's data"""
    # pylint: disable=unexpected-keyword-arg, no-value-for-parameter
    # pylint doesn't understand the argument name magic that happens with @fetch_entity
    if hasattr(current_user,'user_id'):
        return update_user(user_id=current_user.user_id)
    else:
        raise Unauthorized('User does not exist')
        
@App.route('/user/<user_id>', methods=['PUT'])
@login_required
@fetch_entity(User, 'user')
@Admin_permission.require(403)
def update_user(user):
    """Update a user's data"""
    input_data = json.loads(request.data)

    if 'roles' not in input_data:
        abort(422)        

    for role in user.roles:
        if role.name in input_data['roles']:
            input_data['roles'].remove(role.name)
        else:
            user.roles.remove(role)
    for role_name in input_data['roles']:
        role = Role.query.filter_by(name=role_name).first()
        if role is not None:            
            user.roles.append(role)
        else:
            abort(422)
    DB.session.commit()
    return jsonify(user.to_dict_simple())

@App.route('/user/current', methods=['GET'])
def get_current_user():
    """Get information about the current logged in user"""
    # pylint: disable=unexpected-keyword-arg, no-value-for-parameter
    # pylint doesn't understand the argument name magic that happens with @fetch_entity
    if hasattr(current_user,'user_id'):
        return get_user(user_id=current_user.user_id)
    else:
        return jsonify({})
        
@App.route('/user/<user_id>', methods=['GET'])
@login_required
@fetch_entity(User, 'user')
def get_user(user):
    """Get information about a particular user"""
    #user_dict = user.to_dict_simple()
    #user_dict['roles'] = [r.name for r in user.roles]
    return jsonify(get_user_shared(user))

def get_user_shared(user):
    """Get information about a particular user"""
    user_dict = user.to_dict_simple()
    user_dict['roles'] = [r.name for r in user.roles]
    return user_dict


@App.route('/login', methods=['PUT'])
def login():
    """Check credentials and login a user"""
    print "logging in"
    input_data = json.loads(request.data)
    user = User.query.filter_by(username=input_data['username']).first()
    if user and not user.verify_password(input_data['password']):
        user = None
    if user is not None:
        login_user(user)
        identity_changed.send(current_app._get_current_object(), identity=Identity(user.user_id))
        user_dict = user.to_dict_simple()
        user_dict['roles'] = [r.name for r in user.roles]
        return jsonify(get_user_shared(user))
    else:
        raise Unauthorized('Bad username or password')

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
    try:
        user_data = json.loads(request.data)
        #Ideally this would not be hardcoded
        for key in ['username','password']:
            if not key in user_data:
                abort(422)        
        user = User.query.filter_by(username=user_data['username']).first()
        if user is not None:
            raise Conflict('Duplicate username')
        #user = User.query.filter_by(email=user_data['email']).first()
        #if user is not None:
        #    return 'Duplicate email', 409
        password = user_data['password']
        user_data.pop('password', None)
        new_user = User(
            username=user_data['username']#,
            #email=user_data['email'],
        )
        new_user.crypt_password(password)
        if 'roles' not in user_data:
            abort(422)        
        results = DB.session.add(new_user)
        for role_id,role_name in user_data['roles'].iteritems():
            role = Role.query.filter_by(role_id=role_id).first()
            if role is not None:            
                new_user.roles.append(role)
            else:
                abort(422)
        DB.session.commit()                        
        return jsonify(new_user.to_dict_simple())
    except IntegrityError as e:    
        abort(422)
        pass
    except ArgumentError as e:
        abort(422)
        pass
