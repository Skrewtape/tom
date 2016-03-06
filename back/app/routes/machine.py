import json
from sqlalchemy import null
from flask import jsonify, request, abort
from flask_login import login_required
from app import App
from app.types import Machine
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity

@App.route('/machine', methods=['GET'])
@login_required
def get_machines():
    """Get a list of players"""
    return jsonify({m.machine_id: m.to_dict_simple() for m in
                    Machine.query.all()
    })

