import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import DivisionMachine, Division, Machine, Entry, Metadivision
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity
from werkzeug.exceptions import BadRequest,Conflict
import time

@App.route('/metadivision', methods=['GET'])
def get_metadivisions():
    """
description: get all metadivisions
post data: 
    none
url params: 
    none
returns:
    dict of metadivisions
    key of dict is metadivision_id
    """
    return jsonify({m.metadivision_id: m.to_dict_with_divisions() for m in
        Metadivision.query.all()
    })


@login_required
@Admin_permission.require(403)
@App.route('/metadivision', methods=['POST'])
def add_metadivision():
    """
description: Add new metadivision
post data: 
    metadivision_name: string : name of new metadivision
    divisions: dict : key is division_id. value is a non null value
url params: 
    none
returns:
    dict of new metadivision
    """
    metadivision_data = json.loads(request.data)

    new_metadivision = Metadivision(
        name = metadivision_data['metadivision_name'],
    )
    if metadivision_data.has_key('divisions') is False:
        raise BadRequest('Did not specify divisions while creating metadivision')
    for div_id,jsondivision in metadivision_data['divisions'].iteritems():        
        division = Division.query.filter_by(division_id=int(div_id)).first()
        if division is None:
            raise BadRequest('bad division specified for creating metadivision')
        division_id_comparison = Division.division_id.__eq__(division.division_id)        
        check_metadivision_contains_division = Metadivision.divisions.any(division_id_comparison)
        previous_metadivision = Metadivision.query.filter(check_metadivision_contains_division).first()
        if previous_metadivision:
            raise Conflict('a division specified is already part of a metadivision')
            
    for div_id,jsondivision in metadivision_data['divisions'].iteritems():
        division = Division.query.filter_by(division_id=int(div_id)).first()
        new_metadivision.divisions.append(division)
    DB.session.add(new_metadivision)
    DB.session.commit()
    return jsonify(new_metadivision.to_dict_with_divisions())
