import os
import json
import uuid

from flask import jsonify, request, session, current_app, abort

from flask_login import login_required, login_user, logout_user, current_user
from flask_restless.helpers import to_dict

from werkzeug.exceptions import Conflict,Unauthorized

from app import App, DB, Admin_permission, tom_config

from app.routes.v1 import v1_utils

api_ver=''

@App.route(api_ver + '/config/tom', methods=['GET'])
@login_required
def get_tom_config_params():
    """Get details on how tom is configured"""
    config = {}
    config['max_num_concurrent_entries'] = tom_config.max_num_concurrent_entries
    config['max_unstarted_tokens'] = tom_config.max_unstarted_tokens
    config['use_stripe'] = tom_config.use_stripe
    config['player_login'] = tom_config.player_login
    return jsonify(config)
