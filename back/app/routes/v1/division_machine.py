import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import DivisionMachine, Division, Machine, Entry, Tournament, Finals
from app import App, Admin_permission, DB
from app.routes.v1.v1_utils import fetch_entity
from werkzeug.exceptions import BadRequest
import time

api_ver = ''

@App.route(api_ver+'/division_machine/division/<division_id>/machine/<machine_id>', methods=['POST'])  #killroy
@login_required
@Admin_permission.require(403)
@fetch_entity(Division, 'division')
@fetch_entity(Machine, 'machine')
def add_machine_to_division(division,machine):
    """    
description: create a new division_machine based on a machine and add to a division
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


@App.route(api_ver+'/division_machine/<divisionmachine_id>', methods=['DELETE']) #killroy
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

@App.route(api_ver+'/division_machine/<divisionmachine_id>', methods=['PUT']) #killroy
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

