"""Routes for dealing with machines"""
from flask import jsonify

from flask_login import login_required
from flask_restless.helpers import to_dict

from app import App

from app.types import Machine

from app.routes.util import fetch_entity

@App.route('/machine/search/<substring>', methods=['GET'])
@login_required
def search_machines(substring):
    """Get a list of machines matching a query"""
    machines = []
    for m in Machine.query.filter(
        Machine.search_name.contains(substring)
    ).order_by(Machine.name.asc()).limit(10):
            machine = to_dict(m)
            machine['manufacturer'] = to_dict(m.manufacturer)
            machines.append(machine)
    return jsonify(machines=machines)
