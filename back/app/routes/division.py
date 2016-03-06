import json
from sqlalchemy import null
from flask import jsonify, request, abort
from flask_login import login_required
from app import App
from app.types import Division, Machine
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity


@App.route('/division/<division_id>/machine/<machine_id>', methods=['DELETE'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Division, 'division')
@fetch_entity(Machine, 'machine')
def delete_division_machine(division,machine):
    """delete machine from division"""    
    division.machines.remove(machine)
    DB.session.commit()
    return jsonify(machine.to_dict_simple())

@App.route('/division/<division_id>/machine/<machine_id>', methods=['PUT'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Division, 'division')
@fetch_entity(Machine, 'machine')
def add_machine_to_division(division,machine):
    """delete machine from division"""    
    division.machines.append(machine)
    DB.session.commit()
    return jsonify(machine.to_dict_simple())



@App.route('/division', methods=['POST'])
@login_required
@Admin_permission.require(403)
def add_division():
    """Add a player"""
    division_data = json.loads(request.data)
    print division_data
    if 'division_name' not in division_data or 'tournament_id' not in division_data:
        abort(400)
    new_division = Division(
        name = division_data['division_name'],
        tournament_id = division_data['tournament_id']
    )    
    DB.session.add(new_division)
    DB.session.commit()
    return jsonify(new_division.to_dict_with_machines())

@App.route('/division/<division_id>', methods=['GET'])
@login_required
@fetch_entity(Division, 'division')
def get_division(division):
    return jsonify(division.to_dict_with_machines())


@App.route('/division', methods=['GET'])
@login_required
def get_divisions():
    """Get a list of divisions"""
    return jsonify({d.division_id: d.to_dict_simple() for d in
        Division.query.all()
    })

