import json
import app
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Machine, Player, Entry, Score, Division,DivisionMachine
from app.routes import entry
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity
from werkzeug.exceptions import Conflict
from app import tom_config

@App.route('/machine', methods=['GET'])
def get_machines():
    """Get a list of all machines"""
    return jsonify({m.machine_id: m.to_dict_simple() for m in
                    Machine.query.all()
    })

@App.route('/machine/<machine_id>', methods=['GET'])
@fetch_entity(Machine, 'machine')
def get_machine(machine):
    """get a machine"""
    return jsonify(machine.to_dict_with_player())

