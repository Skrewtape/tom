import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import DivisionMachine, Division, Machine, Entry, Tournament, Finals
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity
from werkzeug.exceptions import BadRequest
import time



@App.route('/division_machine/<divisionmachine_id>', methods=['DELETE']) #killroy
@login_required
@Admin_permission.require(403)
@fetch_entity(DivisionMachine, 'divisionmachine')
def delete_division_machine(divisionmachine):
    """    
description: mark division machine as disabled
post data: 
    None
url params: 
    divisionmachine_id: int : division machine id to mark
returns:
    dict of disabled division machine
    """
    divisionmachine.removed=True
    DB.session.commit()
    return jsonify(divisionmachine.to_dict_simple())

@App.route('/division_machine/<divisionmachine_id>', methods=['PUT']) #killroy
@login_required
@Admin_permission.require(403)
@fetch_entity(DivisionMachine, 'divisionmachine')
def enable_division_machine(divisionmachine):
    """    
description: mark division machine as enabled
post data: 
    None
url params: 
    divisionmachine_id: int : division machine id to mark
returns:
    dict of enabled division machine
    """    
    divisionmachine.removed=False
    DB.session.commit()
    return jsonify(divisionmachine.to_dict_simple())


@App.route('/division/<division_id>/machine/<machine_id>', methods=['PUT'])  #killroy
@login_required
@Admin_permission.require(403)
@fetch_entity(Division, 'division')
@fetch_entity(Machine, 'machine')
def add_machine_to_division(division,machine):
    """    
description: add machine to a division
post data: 
    None
url params: 
    division_id: int : division to add machine to
    machine_id: int : machine to add machine to
returns:
    dict of division_machine added to division
    """
    new_division_machine = DivisionMachine(
        machine_id = machine.machine_id,
        division_id = division.division_id
    )
    
    division.machines.append(new_division_machine)
    DB.session.commit()
    return jsonify(new_division_machine.to_dict_simple())

@App.route('/division', methods=['POST']) #killroy was here
@login_required
@Admin_permission.require(403)
def add_division():
    """
description: wrapper around shared_add_division()
notes : see shared_add_division()
    """
    division_data = json.loads(request.data)    
    return shared_add_division(division_data) 

def shared_add_division(division_data): #killroy was here
    """
description: Add a division to a tournament
post data: 
    division_name: string : name of division
    tournament_id: int : tournament_id of tournament to add division to
    number_of_scores_per_entry: number of scores per ticket for division
url params: 
    none
returns:
    dict of all added division with division machines    
    """
    
    if 'division_name' not in division_data or 'tournament_id' not in division_data:
        raise BadRequest('Did not specify division_name or tournament_id in post data')
    new_division = Division(
        name = division_data['division_name'],
        tournament_id = division_data['tournament_id']
    )
    if 'number_of_scores_per_entry' in division_data:
        new_division.number_of_scores_per_entry = division_data['number_of_scores_per_entry']
    else:
        #FIXME : this should not be hardcoded
        new_division.number_of_scores_per_entry = 4
    DB.session.add(new_division)
    DB.session.commit()
    return jsonify(new_division.to_dict_with_machines())


@App.route('/division/ready_for_finals', methods=['GET']) #killroy was here
def get_divisions_for_finals():
    divisions_dict={}
    divisions = Division.query.all()
    for division in divisions:
        finals = Finals.query.filter_by(division_id=division.division_id).first()
        if finals is None:
            divisions_dict[division.division_id]= division.to_dict_simple()
    return jsonify(divisions_dict)

@App.route('/division/<division_id>', methods=['GET']) #killroy
@fetch_entity(Division, 'division')
def get_division(division):
    """
description: Get a specific division
post data: 
    none
url params: 
    division_id: int :id of division to retrieve
returns:
    dict of division    
    """
    division_dict = division.to_dict_with_machines()    
    if division.tournament.single_division:
        division_dict['full_name']="%s Division" % division.name        
    if division.tournament.single_division is False:
        division_dict['full_name']="%s Tournament, %s Division" % (division.tournament.name,division.name)        
    return jsonify(division_dict)

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

