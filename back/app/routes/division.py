"""Routes for dealing with divisions"""
import json

from flask import jsonify, request

from flask_login import login_required
from flask_restless.helpers import to_dict

from app import App, Admin_permission, DB

from app.types import Tournament, Division, Machine

from app.routes.util import fetch_entity

@App.route('/tournament/<tournament_id>/division', methods=['POST'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Tournament, 'tournament')
def add_division(tournament):
    """Create a new division"""
    division_data = json.loads(request.data)
    new_division = Division(
        name = division_data['name']
    )
    tournament.divisions.append(new_division)
    DB.session.add(new_division)
    DB.session.commit()
    return jsonify(to_dict(new_division))

@App.route('/division/<division_id>', methods=['GET'])
@login_required
@fetch_entity(Division, 'division')
def get_division(division):
    """Get a division"""
    return jsonify(to_dict(division))

@App.route('/division/<division_id>/machine', methods=['GET'])
@login_required
@fetch_entity(Division, 'division')
def get_division_machines(division):
    """Get a division's machines"""
    return jsonify(machines=[to_dict(m) for m in division.machines])

@App.route('/division/<division_id>/machine/<machine_id>', methods=['PUT'])
@login_required
@fetch_entity(Division, 'division')
@fetch_entity(Machine, 'machine')
def add_machine(division, machine):
    """Add a machine to a division"""
    if machine not in division.machines:
        division.machines.append(machine)
        DB.session.commit();
    return jsonify(to_dict(division))

@App.route('/division/<division_id>/machine/<machine_id>', methods=['DELETE'])
@login_required
@fetch_entity(Division, 'division')
@fetch_entity(Machine, 'machine')
def remove_machine(division, machine):
    """Removes a machine from a division"""
    if machine in division.machines:
        division.machines.remove(machine)
        DB.session.commit();
    return jsonify(to_dict(division))
