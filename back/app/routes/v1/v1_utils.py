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
from functools import wraps

import time

def fetch_entity(model_class, arg_name):
    """Generate a wrapper to turn an id into a model object"""
    def wrap(decorated_f):
        """Generate a decorator to turn an id into a model object"""
        @wraps(decorated_f)
        def decorator(*args, **kwargs):
            """Decorator to turn an id into a model object"""
            model_id = kwargs.pop(arg_name + '_id', None)
            kwargs[arg_name] = model_class.query.get(model_id)
            if kwargs[arg_name] is None:
                error_arg_list = (arg_name, model_class.__name__, model_class.__name__, model_id)
                raise BadRequest("Expecting url param %s_id with valid %s id but could not find valid %s with id %s" % error_arg_list)
            return decorated_f(*args, **kwargs)
        return decorator
    return wrap


