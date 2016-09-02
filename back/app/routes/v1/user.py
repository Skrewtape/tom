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

from app.types import User, Role, Player

from app.routes.v1.v1_utils import fetch_entity
from app.routes.v1 import v1_utils

from sqlalchemy.exc import ArgumentError,InvalidRequestError,IntegrityError
from werkzeug.exceptions import Conflict, BadRequest

import time

api_ver = ''

@App.route(api_ver + '/user', methods=['GET'])
@login_required
@Admin_permission.require(403)
def get_users():
    """Get a list of users"""    
    return jsonify(users=[u.to_dict_simple() for u in User.query.order_by(User.user_id.asc()).all()])

@App.route(api_ver + '/user/current', methods=['PUT'])
def update_current_user():
    """Update the current user's data"""
    # pylint: disable=unexpected-keyword-arg, no-value-for-parameter
    # pylint doesn't understand the argument name magic that happens with @fetch_entity
    if hasattr(current_user,'user_id'):
        return update_user(user_id=current_user.user_id)
    else:
        raise Unauthorized('User does not exist')

@App.route(api_ver + '/user/<user_id>', methods=['PUT'])
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

@App.route(api_ver + '/user/current', methods=['GET'])
def get_current_user():
    """Get information about the current logged in user"""
    # pylint: disable=unexpected-keyword-arg, no-value-for-parameter
    # pylint doesn't understand the argument name magic that happens with @fetch_entity    
    if hasattr(current_user,'user_id'):
        user_dict = User.query.filter_by(user_id=current_user.user_id).first().to_dict_simple()
        return jsonify(user_dict)
    #return get_user(user_id=current_user.user_id)
    else:
        return jsonify({})

@App.route(api_ver + '/user/<user_id>', methods=['GET'])
@login_required
@fetch_entity(User, 'user')
def get_user(user):
    """Get information about a particular user"""
    #user_dict = user.to_dict_simple()
    #user_dict['roles'] = [r.name for r in user.roles]
    return jsonify(v1_utils.get_user(user))

@App.route(api_ver + '/user', methods=['POST'])
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


    
