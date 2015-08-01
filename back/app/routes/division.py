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
    division_dict = to_dict(division)
    division_dict['tournament'] = to_dict(division.tournament)
    return jsonify(division_dict)
