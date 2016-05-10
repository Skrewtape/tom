import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import DivisionMachine, Division, Machine, Entry, Tournament
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity
from werkzeug.exceptions import BadRequest
import time


# @App.route('/division/<division_id>/machine/<machine_id>', methods=['DELETE'])
# @login_required
# @Admin_permission.require(403)
# @fetch_entity(Division, 'division')
# @fetch_entity(Machine, 'machine')
# def delete_division_machine(division,machine):
#     """delete machine from division"""        
#     #FIXME : add check for machine before removing
#     division.machines.remove(machine)
#     DB.session.commit()
#     return jsonify(machine.to_dict_simple())

@App.route('/division_machine/<divisionmachine_id>', methods=['DELETE'])
@login_required
@Admin_permission.require(403)
@fetch_entity(DivisionMachine, 'divisionmachine')
def delete_division_machine(divisionmachine):
    """delete machine from division"""        
    #FIXME : add check for machine before removing
    divisionmachine.removed=True
    DB.session.commit()
    return jsonify(divisionmachine.to_dict_simple())

@App.route('/division_machine/<divisionmachine_id>', methods=['PUT'])
@login_required
@Admin_permission.require(403)
@fetch_entity(DivisionMachine, 'divisionmachine')
def enable_division_machine(divisionmachine):
    """delete machine from division"""        
    #FIXME : add check for machine before removing
    divisionmachine.removed=False
    DB.session.commit()
    return jsonify(divisionmachine.to_dict_simple())


@App.route('/division/<division_id>/machine/<machine_id>', methods=['PUT'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Division, 'division')
@fetch_entity(Machine, 'machine')
def add_machine_to_division(division,machine):
    """add machine to division"""    
    #FIXME : add check for machine before adding
    new_division_machine = DivisionMachine(
        machine_id = machine.machine_id,
        division_id = division.division_id
    )
    
    division.machines.append(new_division_machine)
    DB.session.commit()
    return jsonify(new_division_machine.to_dict_simple())



@App.route('/division', methods=['POST'])
@login_required
@Admin_permission.require(403)
def add_division():
    # """Add a player"""
    return shared_add_division(request.data)
    # if 'division_name' not in division_data or 'tournament_id' not in division_data:
    #     raise BadRequest('Did not specify division_name or tournament_id in post data')
    # new_division = Division(
    #     name = division_data['division_name'],
    #     tournament_id = division_data['tournament_id']
    # )
    # # if 'number_of_scores_per_entry' in division_data:
    # #     new_division.number_of_scores_per_entry = division_data['number_of_scores_per_entry']
    # # else:
    # #     new_division.number_of_scores_per_entry = 4
    # DB.session.add(new_division)
    # DB.session.commit()
    # return jsonify(new_division.to_dict_with_machines())

def shared_add_division(post_data):
    """Add a player"""
    division_data = json.loads(post_data)
    if 'division_name' not in division_data or 'tournament_id' not in division_data:
        raise BadRequest('Did not specify division_name or tournament_id in post data')
    new_division = Division(
        name = division_data['division_name'],
        tournament_id = division_data['tournament_id']
    )
    if 'number_of_scores_per_entry' in division_data:
        new_division.number_of_scores_per_entry = division_data['number_of_scores_per_entry']
    else:
        new_division.number_of_scores_per_entry = 4
    DB.session.add(new_division)
    DB.session.commit()
    return jsonify(new_division.to_dict_with_machines())


@App.route('/division/<division_id>', methods=['GET'])
@fetch_entity(Division, 'division')
def get_division(division):
    return jsonify(division.to_dict_with_machines())

@App.route('/division/<division_id>/rankings', methods=['GET'])
@fetch_entity(Division, 'division')
def get_division_rankings(division):
    division_entries = Entry.query.filter_by(division_id=division.division_id,voided=False,completed=True).order_by(Entry.rank.asc()).limit(150)
    division_entries_dict = {}
    division_entries_list = []
    for division_entry in division_entries:
        division_entries_list.append(division_entry.to_dict_with_scores())
    return jsonify({'rankings':division_entries_list})


@App.route('/division', methods=['GET'])
def get_divisions():
    """Get a list of divisions"""
    return jsonify({d.division_id: d.to_dict_with_machines() for d in
        Division.query.all()
    })

