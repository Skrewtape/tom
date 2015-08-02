"""Routes for dealing with tournaments"""
import json

from flask import jsonify, request

from flask_login import login_required
from flask_restless.helpers import to_dict

from app import App, Admin_permission, DB

from app.types import Tournament

from app.routes.util import fetch_entity

@App.route('/tournament', methods=['POST'])
@login_required
@Admin_permission.require(403)
def create_tournament():
    """Create a new tournament"""
    tournament_data = json.loads(request.data)
    new_tournament = Tournament(
        name = tournament_data['name']
    )
    DB.session.add(new_tournament)
    DB.session.commit()
    return jsonify(to_dict(new_tournament))

@App.route('/tournament/<tournament_id>', methods=['GET'])
@login_required
@fetch_entity(Tournament, 'tournament')
def get_tournament(tournament):
    """Get a tournament"""
    tournament_data = to_dict(tournament)
    tournament_data['divisions'] = [to_dict(d) for d in tournament.divisions]
    return jsonify(tournament_data)

@App.route('/tournament', methods=['GET'])
@login_required
def get_tournaments():
    """Get a list of tournaments"""
    return jsonify(tournaments=[
        to_dict(t) for t in
        Tournament.query.order_by(Tournament.name.asc()).all()
    ])

@App.route('/tournament/<tournament_id>/begin', methods=['PUT'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Tournament, 'tournament')
def start_tournament(tournament):
    tournament.active = True
    DB.session.commit()
    return jsonify(to_dict(tournament))

@App.route('/tournament/<tournament_id>/end', methods=['PUT'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Tournament, 'tournament')
def end_tournament(tournament):
    tournament.active = False
    DB.session.commit()
    return jsonify(to_dict(tournament))
