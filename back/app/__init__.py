import os

from json import loads, dumps

from traceback import format_exception_only

import flask
from flask import Flask, jsonify
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_principal import Principal, Permission, RoleNeed
from flask_cors import CORS
from app import secret_config
from werkzeug.exceptions import default_exceptions, HTTPException

App = Flask(__name__)
App.secret_key = secret_config.app_secret_key
App.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
App.config['SQLALCHEMY_POOL_SIZE']=20
App.config['SQLALCHEMY_POOL_TIMEOUT']=5
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

Void_permission = Permission(RoleNeed('void'))
Admin_permission = Permission(RoleNeed('admin'))
Desk_permission = Permission(RoleNeed('desk'))
Scorekeeper_permission = Permission(RoleNeed('scorekeeper'))

from app import auth
from app import routes

def make_json_error(ex):
    """Turn an exception into a chunk of JSON"""
    response = jsonify({})
    response_dict = loads(response.get_data())
    if hasattr(ex, 'state_go'):
        response_dict['state_go'] = ex.state_go
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
    App.logger.exception(exception)
    # App.logger.error(format_exception_only(type(exception), exception))
    return make_json_error(exception), 500

App.static_path = "%s/static" % os.path.dirname(os.path.realpath(__file__))

