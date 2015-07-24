"""Routes for dealing with machines"""
from flask import jsonify, request

from flask_login import login_required
from flask_restless.helpers import to_dict

from app import App, DB

from app.types import Machine, Division

from app.routes.util import fetch_entity

def machine_dict(raw_machines):
    machines = []
    for m in raw_machines:
        machine = to_dict(m)
        machine['manufacturer'] = to_dict(m.manufacturer)
        machines.append(machine)
    return jsonify(machines=machines)

@App.route('/machine/search', methods=['GET'])
@login_required
def search_machines():
    """Get a list of machines matching a query"""
    return machine_dict(Machine.query.filter(
        Machine.search_name.contains(request.args.get('substring'))
    ).order_by(Machine.name.asc()).limit(10))

@App.route('/division/<division_id>/machine', methods=['GET'])
@login_required
@fetch_entity(Division, 'division')
def get_division_machines(division):
    """Get a division's machines"""
    return machine_dict(division.machines)

@App.route('/division/<division_id>/machine/<machine_id>', methods=['PUT'])
@login_required
@fetch_entity(Division, 'division')
@fetch_entity(Machine, 'machine')
def add_machine(division, machine):
    """Add a machine to a division"""
    if machine not in division.machines:
        division.machines.append(machine)
        DB.session.commit();
    return machine_dict(division.machines)

@App.route('/division/<division_id>/machine/<machine_id>', methods=['DELETE'])
@login_required
@fetch_entity(Division, 'division')
@fetch_entity(Machine, 'machine')
def remove_machine(division, machine):
    """Removes a machine from a division"""
    if machine in division.machines:
        division.machines.remove(machine)
        DB.session.commit();
    return machine_dict(division.machines)
