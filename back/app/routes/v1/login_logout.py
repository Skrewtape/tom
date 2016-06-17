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

from app.routes.util import fetch_entity

from sqlalchemy.exc import ArgumentError,InvalidRequestError,IntegrityError
from werkzeug.exceptions import Conflict, BadRequest

import time

api_ver = ''

@App.route(api_ver+'/login/player/pin/<pin>', methods=['PUT'])
def login_player(pin):    
    #FIXME : need to seperate out player purchase
    # pylint: disable=unexpected-keyword-arg, no-value-for-parameter
    # pylint doesn't understand the argument name magic that happens with @fetch_entity
    #input_data = json.loads(request.data)
    #user = User.query.filter_by(username=input_data['username']).first()
    player = Player.query.filter_by(pin=int(pin)).first()
    if player and not player.verify_password(int(pin)):
        player = None
    if  player is not None:
        login_user(player)
        identity_changed.send(current_app._get_current_object(), identity=Identity(player.player_id))
        player_dict = player.to_dict_with_team()        
        return jsonify(player_dict)
    else:
        raise Unauthorized('Bad username or password')


@App.route(api_ver+'/login', methods=['PUT'])
def login():
    """Check credentials and login a user"""    
    input_data = json.loads(request.data)
    user = User.query.filter_by(username=input_data['username']).first()
    if user and not user.verify_password(input_data['password']):
        user = None
    if user is not None:
        login_user(user)
        identity_changed.send(current_app._get_current_object(), identity=Identity(user.user_id))
        user_dict = user.to_dict_simple()
        user_dict['roles'] = [r.name for r in user.roles]
        return jsonify(user.to_dict_simple())
    else:
        raise Unauthorized('Bad username or password')

@App.route(api_ver+'/logout', methods=['PUT'])
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
