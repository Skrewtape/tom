import os
import json
import uuid

from flask import jsonify, request, session, current_app, abort

from flask_login import login_required, login_user, logout_user, current_user
from flask_principal import identity_changed, AnonymousIdentity, Identity
from flask_restless.helpers import to_dict

from werkzeug.exceptions import Conflict,Unauthorized

from app import App, DB, Admin_permission

from app.types import User, Role, Player, Division

from app.routes.util import fetch_entity

from sqlalchemy.exc import ArgumentError,InvalidRequestError,IntegrityError
from werkzeug.exceptions import Conflict, BadRequest
from functools import wraps

import time

def add_division(division_data): #killroy was here
    if 'division_name' not in division_data or 'tournament_id' not in division_data:
        raise BadRequest('Did not specify division_name or tournament_id in post data')
    new_division = Division(
        name = division_data['division_name'],
        tournament_id = division_data['tournament_id']
    )
    if 'number_of_scores_per_entry' in division_data:
        new_division.number_of_scores_per_entry = division_data['number_of_scores_per_entry']
    else:
        #FIXME : this should not be hardcoded
        new_division.number_of_scores_per_entry = 4
    if 'stripe_sku' in division_data:
        new_division.stripe_sku = division_data['stripe_sku']
    if 'local_price' in division_data:
        new_division.local_price = division_data['local_price']
        
    DB.session.add(new_division)
    DB.session.commit()
    return jsonify(new_division.to_dict_with_machines())


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


