import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import DivisionMachine, Division, Machine, Entry, Metadivision
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity
from werkzeug.exceptions import BadRequest
import time

@App.route('/metadivision', methods=['GET'])
def get_metadivisions():
    """Get a list of all metadivisions"""
    
    return jsonify({m.metadivision_id: m.to_dict_with_divisions() for m in
        Metadivision.query.all()
    })


@login_required
@Admin_permission.require(403)
@App.route('/metadivision', methods=['POST'])
def add_metadivision():
    """Add a metadivision"""
    metadivision_data = json.loads(request.data)

    new_metadivision = Metadivision(
        name = metadivision_data['metadivision_name'],
    )
    if metadivision_data.has_key('divisions') is False:
        raise BadRequest('Did not specify divisions while creating metadivision')
    for jsondivision in metadivision_data['divisions']:        
        division = Division.query.filter_by(division_id=jsondivision['division_id']).first()
        if division is None:
            raise BadRequest('bad division specified for creating metadivision')
    for jsondivision in metadivision_data['divisions']:
        division = Division.query.filter_by(division_id=jsondivision['division_id']).first()
        new_metadivision.divisions.append(division)
    DB.session.add(new_metadivision)
    DB.session.commit()
    return jsonify(new_metadivision.to_dict_simple())
