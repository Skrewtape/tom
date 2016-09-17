import os
import json
import uuid

from flask import jsonify, request, session, current_app, abort

from flask_login import login_required, login_user, logout_user, current_user
from flask_principal import identity_changed, AnonymousIdentity, Identity
from flask_restless.helpers import to_dict

from werkzeug.exceptions import Conflict,Unauthorized

from app import App, DB, Admin_permission

from app.types import User, Role, Player, Division, Tournament

from app.routes.util import fetch_entity
from app.routes import test
from sqlalchemy.exc import ArgumentError,InvalidRequestError,IntegrityError
from werkzeug.exceptions import Conflict, BadRequest
from functools import wraps
from ranking import Ranking
from operator import itemgetter

import time

def get_players_ranked_by_qualifying(division_id,num_players,checked_players=None):
    if checked_players:
        checked_players = " where player_id in (%s) " % checked_players
    else:
        checked_players = ""
    entry_results = DB.engine.execute("select entry_id, player_id, entry_score_sum, rank() over (order by entry_score_sum desc) as rank from (select entry_id, player_id, sum(entry_score) as entry_score_sum  from (select entry.player_id, score.entry_id, testing_papa_scoring(rank() over (partition by division_machine_id order by score.score desc)) as entry_score from score,entry where score.entry_id = entry.entry_id and division_id = %s and completed = true and voided = false) as ss %s group by ss.entry_id, player_id order by entry_score_sum desc limit %d) as tt" % (division_id, checked_players,num_players) )    
    ranked_players = []
    for player_result in entry_results:
        ranked_players.append(player_result)
    return ranked_players


def get_players_ranked_by_qualifying_herb(division_id,num_players,checked_players=None):
    # if checked_players:
    #     checked_players = " where player_id in (%s) " % checked_players
    # else:
    #     checked_players = ""
    # entry_results = DB.engine.execute("select player_id, entry_score_sum, rank() over (order by entry_score_sum desc) as rank from (select  player_id, sum(entry_score) as entry_score_sum  from (select entry.player_id,  testing_papa_scoring(rank() over (partition by division_machine_id order by score.score desc)) as entry_score from score,entry where score.entry_id = entry.entry_id and division_id = %s and completed = true and voided = false) as ss %s group by player_id order by entry_score_sum desc limit %d) as tt" % (division_id, checked_players,num_players) )
    # unranked_players = []
    # unranked_player_tracker = {}
    # #ranked_list =  list(Ranking(entry_result,key=lambda e: int(e.),reverse=True))    
    # for player_result in entry_results:
    #     #print "%s %s %s" %(player_result.player_id,player_result.entry_score_sum,player_result.entry_id) 
    #     if player_result.player_id not in unranked_player_tracker:
    #         unranked_player_tracker[player_result.player_id]=player_result
    #     else:
    #         if unranked_player_tracker[player_result.player_id].entry_score_sum <= player_result.entry_score_sum:
    #             unranked_player_tracker[player_result.player_id]=player_result
    #             #ranked_players.append(player_result)
    # for key,value in unranked_player_tracker.iteritems():
    #     unranked_players.append(value)
    # sorted_players = sorted(unranked_players, key=itemgetter('rank'))
    # ranked_players =  list(Ranking(sorted_players,key=lambda e: e.rank,reverse=True))                    
    herb_player_points,herb_results = test.get_herb_division_results_ex(division_id=int(division_id))            
    ranked_players = list(Ranking(herb_player_points[int(division_id)],key=lambda e: e['total_points']))
    return ranked_players



def add_division(division_data): #killroy was here
    if 'division_name' not in division_data or 'tournament_id' not in division_data:
        raise BadRequest('Did not specify division_name or tournament_id in post data')
    tournament = Tournament.query.filter_by(tournament_id=division_data['tournament_id']).first()        
    if 'number_of_scores_per_entry' not in division_data and tournament.scoring_type != "herb":
        raise BadRequest('Did not specify number of scores per entry')
    new_division = Division(
        name = division_data['division_name'],
        tournament_id = division_data['tournament_id']
    )
    if 'number_of_scores_per_entry' in division_data:
        new_division.number_of_scores_per_entry = division_data['number_of_scores_per_entry']
    if 'number_of_scores_per_entry' not in division_data and tournament.scoring_type == "herb":
        new_division.number_of_scores_per_entry = 1
        
    if 'stripe_sku' in division_data:
        new_division.stripe_sku = division_data['stripe_sku']
    if 'local_price' in division_data:
        new_division.local_price = division_data['local_price']
        
    DB.session.add(new_division)
    DB.session.commit()
    return jsonify(new_division.to_dict_with_machines())


def fetch_entity(model_class, arg_name):
    """Generate a wrapper to turn an id into a model object"""
    def wrap(decorated_f):
        """Generate a decorator to turn an id into a model object"""
        @wraps(decorated_f)
        def decorator(*args, **kwargs):
            """Decorator to turn an id into a model object"""
            model_id = kwargs.pop(arg_name + '_id', None)
            kwargs[arg_name] = model_class.query.get(model_id)
            if kwargs[arg_name] is None:
                error_arg_list = (arg_name, model_class.__name__, model_class.__name__, model_id)
                raise BadRequest("Expecting url param %s_id with valid %s id but could not find valid %s with id %s" % error_arg_list)
            return decorated_f(*args, **kwargs)
        return decorator
    return wrap


