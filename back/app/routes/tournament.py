import json
from sqlalchemy import null
from flask import jsonify, request, abort
from flask_login import login_required
from app import App
from app.types import Tournament,Division
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity
from app.routes import division
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
    if 'team_tournament' in tournament_data and tournament_data['team_tournament']:    
        new_tournament.team_tournament = True
    DB.session.add(new_tournament)
    DB.session.commit()
    if 'single_division' in tournament_data and tournament_data['single_division']:
        new_tournament.single_division=True
        division.shared_add_division('{"division_name":"%s_all","tournament_id":"%d", "number_of_scores_per_entry":"%d"}' % (new_tournament.name,new_tournament.tournament_id, tournament_data['number_of_scores_per_entry']))
    else:
        new_tournament.single_division=False                
    DB.session.commit()
    return jsonify(new_tournament.to_dict_with_divisions())

@App.route('/tournament', methods=['GET'])
def get_tournaments():
    """Get a list of tournaments"""
    
    return jsonify({t.tournament_id: t.to_dict_with_divisions() for t in
        Tournament.query.all()
    })

@App.route('/tournament/active', methods=['GET'])
def get_active_tournaments():
    """Get a list of active tournaments"""
    
    return jsonify({t.tournament_id: t.to_dict_with_divisions() for t in
        Tournament.query.filter_by(active=True).all()
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
