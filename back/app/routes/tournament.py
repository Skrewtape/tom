import json
from sqlalchemy import null
from flask import jsonify, request, abort
from flask_login import login_required
from app import App
from app.types import Tournament,Division
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity
from werkzeug.exceptions import BadRequest

@App.route('/tournament', methods=['POST'])
@login_required
@Admin_permission.require(403)
def add_tournament():
    """Add a player"""
    tournament_data = json.loads(request.data)
    if 'tournament_name' not in tournament_data:
        raise BadRequest('tournament_name not found in post data')
    new_tournament = Tournament(
        name = tournament_data['tournament_name'],
        active = False
    )    
    DB.session.add(new_tournament)
    if 'single_division' in tournament_data:
        if tournament_data['single_division']:
            new_division = Division(name='all',
                                    tournament_id=new_tournament.tournament_id)
            DB.session.add(new_division)
            new_tournament.divisions.append(new_division)
            
    DB.session.commit()        
    return jsonify(new_tournament.to_dict_with_divisions())

@App.route('/tournament', methods=['GET'])
def get_tournaments():
    """Get a list of players"""
    
    return jsonify({t.tournament_id: t.to_dict_with_divisions() for t in
        Tournament.query.all()
    })

@App.route('/tournament/<tournament_id>', methods=['GET'])
@fetch_entity(Tournament, 'tournament')
def get_tournament(tournament):
    """Get a tournament"""    
    return jsonify(tournament.to_dict_with_divisions())


@App.route('/tournament/<tournament_id>/begin', methods=['PUT'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Tournament, 'tournament')
def start_tournament(tournament):
    tournament.active = True
    DB.session.commit()
    return jsonify(tournament.to_dict_simple())

@App.route('/tournament/<tournament_id>/end', methods=['PUT'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Tournament, 'tournament')
def end_tournament(tournament):
    tournament.active = False
    DB.session.commit()
    return jsonify(tournament.to_dict_simple())
