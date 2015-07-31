import os

from json import loads, dumps

from traceback import format_exception_only

import flask
from flask import Flask, jsonify
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_principal import Principal, Permission, RoleNeed
from flask_cors import CORS

from werkzeug.exceptions import default_exceptions, HTTPException

App = Flask(__name__)
App.secret_key = '\xee\xaa\x99\xdc\xcd\xbf\x0e2\xf5D\x94\xe4\xc7\x90\xaf\xd2\xea\x89\x95_\x94\x82\x8b\xdc'

App.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']

if 'DYNO' not in os.environ:
    App.config['DEBUG'] = True

CORS(
    App,
    headers=['Content-Type', 'Accept'],
    send_wildcard=False,
    supports_credentials=True,
)

Login_manager = LoginManager()
Login_manager.init_app(App)

Principal(App)

DB = SQLAlchemy(App)

Admin_permission = Permission(RoleNeed('admin'))

from app import auth
from app import routes

def make_json_error(ex):
    """Turn an exception into a chunk of JSON"""
    response = jsonify({})
    response_dict = loads(response.get_data())
    if isinstance(ex, HTTPException):
        response.status_code = ex.code
        if isinstance(ex.description, Permission):
            response_dict['message'] = "Permission denied"
        else:
            response_dict['message'] = str(ex.description)
    else:
        response.status_code = 500
        response_dict['message'] = str(ex)
    if response.status_code == 500:
        response_dict['stack'] = str(format_exception_only(type(ex), ex))
    response.set_data(dumps(response_dict))
    return response

for code in default_exceptions.iterkeys():
    App.error_handler_spec[None][code] = make_json_error

@App.errorhandler(Exception)
def app_error(exception):
    """Handle uncaught exceptions from the app"""
    App.logger.error(format_exc(exception))
    return make_json_error(exception), 500
