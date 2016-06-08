import json
from sqlalchemy import null
from flask import jsonify, request, abort
from flask_login import login_required
from app import App
from app.types import Tournament,Division
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity,i_am_a_teapot
from app.routes import division
from werkzeug.exceptions import BadRequest
from sqlalchemy.exc import IntegrityError

@App.route('/tournament', methods=['POST']) 
@login_required
@Admin_permission.require(403)
def add_tournament():
    """
description: Add a tournament
post data: 
    tournament_name: string : name of tournament
    team_tournament: boolean : is this a team tournament
    single_division: boolean : is this a single division tournament
url params: 
    none
returns:
    new tournament(and its divisions)
    """
    tournament_data = json.loads(request.data)
    if 'tournament_name' not in tournament_data:
        raise BadRequest('tournament_name not found in post data')    
    new_tournament = Tournament(
        name = tournament_data['tournament_name'],
        active = False
    )
    if 'team_tournament' in tournament_data and tournament_data['team_tournament']:    
        new_tournament.team_tournament = True
    else:
        new_tournament.team_tournament = False    
    
    try:
        DB.session.add(new_tournament)        
        DB.session.commit()        
    except IntegrityError as e:
        raise i_am_a_teapot('Can not create tournament - got the following error from the database : %s !' % e,"app")    
    if 'single_division' in tournament_data and tournament_data['single_division']:
        new_tournament.single_division=True
        single_division_data={}
        single_division_data['division_name']="%s_all" % new_tournament.name
        single_division_data['tournament_id']=str(new_tournament.tournament_id)
        single_division_data['number_of_scores_per_entry']=str(tournament_data['number_of_scores_per_entry'])        
        division.shared_add_division(single_division_data)
    else:
        new_tournament.single_division=False                
    DB.session.commit()
    return jsonify(new_tournament.to_dict_with_divisions())

@App.route('/tournament', methods=['GET']) 
def get_tournaments(): 
    """
description: Get all tournaments (active and inactive)
post data: 
    none
url params: 
    none
returns:
    dict of all tournaments
    dict key is tournament id
    """
    return jsonify({t.tournament_id: t.to_dict_with_divisions() for t in
        Tournament.query.all()
    })

@App.route('/tournament/active', methods=['GET'])
def get_active_tournaments():
    """
description: Get all active tournaments
post data: 
    none
url params: 
    none
returns:
    dict of all tournaments
    dict key is tournament id, value is dict of tournament
    """

    return jsonify({t.tournament_id: t.to_dict_with_divisions() for t in
        Tournament.query.filter_by(active=True).all()
    })


@App.route('/tournament/<tournament_id>', methods=['GET']) 
@fetch_entity(Tournament, 'tournament')
def get_tournament(tournament):
    """
description: Get a specific tournament
post data: 
    none
url params: 
    tournament_id:id of the tournament to retrieve
returns:
    dict of tournament requested
    """
    
    return jsonify(tournament.to_dict_with_divisions())


@App.route('/tournament/<tournament_id>/begin', methods=['PUT'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Tournament, 'tournament')
def start_tournament(tournament):
    """
description: start a tournament
post data: 
    none
url params: 
    tournament_id:id of the tournament to start
returns:
    dict of tournament started
    """

    tournament.active = True
    DB.session.commit()
    return jsonify(tournament.to_dict_simple())

@App.route('/tournament/<tournament_id>/end', methods=['PUT'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Tournament, 'tournament')
def end_tournament(tournament):
    """
description: stop a tournament
post data: 
    none
url params: 
    tournament_id:id of the tournament to stop
returns:
    dict of tournament stopped
    """

    tournament.active = False
    DB.session.commit()
    return jsonify(tournament.to_dict_simple())
