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

@App.route(api_ver+'/role', methods=['GET'])
@login_required
@Admin_permission.require(403)
def get_roles():
    """Get a list of roles"""
    #return jsonify(roles=[r.to_dict_simple() for r in Role.query.all()])
    return jsonify({r.role_id:r.to_dict_simple() for r in Role.query.all()})
