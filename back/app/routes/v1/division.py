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
from app.routes.v1 import v1_utils
from flask_restless.helpers import to_dict

api_ver = ''

@App.route(api_ver+'/division', methods=['POST']) #killroy was here
@login_required
@Admin_permission.require(403)
def add_division():
    """
description: Add a division to a tournament
post data: 
    division_name: string : name of division
    tournament_id: int : tournament_id of tournament to add division to
    number_of_scores_per_entry: int : number of scores per ticket for division
    stripe_sku: string : the stripe sku for this ticket
url params: 
    none
returns:
    dict of all added division with division machines    
    """    
    division_data = json.loads(request.data)    
    return v1_utils.add_division(division_data) 

@App.route(api_ver+'/division/<division_id>', methods=['PUT']) #killroy was here
@login_required
@Admin_permission.require(403)
@fetch_entity(Division, 'division')
def edit_division(division):
    division_data = json.loads(request.data)    
    if "finals_player_selection_type" in division_data:
        division.finals_player_selection_type = division_data['finals_player_selection_type']
    if "finals_num_qualifiers" in division_data:
        division.finals_num_qualifiers = division_data['finals_num_qualifiers']
    if "finals_num_qualifiers_ppo_a" in division_data:
        division.finals_num_qualifiers_ppo_a = division_data['finals_num_qualifiers_ppo_a']
    if "finals_num_qualifiers_ppo_b" in division_data:
        division.finals_num_qualifiers_ppo_b = division_data['finals_num_qualifiers_ppo_b']
    if "finals_num_players_per_group" in division_data:
        division.finals_num_players_per_group = division_data['finals_num_players_per_group']
    if "finals_num_games_per_match" in division_data:
        division.finals_num_games_per_match = division_data['finals_num_games_per_match']
    if "finals_challonge_name_ppo_a" in division_data:
        division.finals_challonge_name_ppo_a = division_data['finals_challonge_name_ppo_a']
    if "finals_challonge_name_ppo_b" in division_data:
        division.finals_challonge_name_ppo_b = division_data['finals_challonge_name_ppo_b']
         

    DB.session.commit()
    return jsonify({})
    #return v1_utils.add_division(division_data) 


@App.route(api_ver+'/division/ready_for_finals', methods=['GET']) #killroy was here
def get_divisions_for_finals():
    divisions_dict={}
    divisions = Division.query.all()
    for division in divisions:
        finals = Finals.query.filter_by(division_id=division.division_id).first()
        if finals is None:
            divisions_dict[division.division_id]= division.to_dict_simple()
    return jsonify(divisions_dict)

@App.route(api_ver+'/division/division_id/<division_id>', methods=['GET']) #killroy
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

# @App.route(api_ver+'/division/<division_id>/rankings', methods=['GET'])
# @fetch_entity(Division, 'division')
# def get_division_rankings(division):
#     division_entries = Entry.query.filter_by(division_id=division.division_id,voided=False,completed=True).order_by(Entry.rank.asc()).limit(150)
#     division_entries_dict = {}
#     division_entries_list = []
#     for division_entry in division_entries:
#         division_entries_list.append(division_entry.to_dict_with_scores())
#     return jsonify({'rankings':division_entries_list})


@App.route(api_ver+'/division', methods=['GET'])
def get_divisions():
    """Get a list of divisions"""
    return jsonify({d.division_id: d.to_dict_with_machines() for d in
        Division.query.all()
    })

@App.route(api_ver+'/division/active', methods=['GET'])
def get_active_divisions():
    """Get a list of active divisions"""
    return jsonify({d.division_id: d.to_dict_with_machines() for d in
                Division.query.join(Tournament).filter_by(active=True).all()
    })

@App.route(api_ver+'/division/<division_id>/players/ranked')
@fetch_entity(Division, 'division')
def get_players_ranked_by_qualifying(division):
    #FIXME : should not be hardcoded    
    num_players_to_qualify = 24
    num_non_qualified_players = 100
    ranked_players = v1_utils.get_players_ranked_by_qualifying(division.division_id,num_non_qualified_players)    
    #jsonifyd_list = [{'player_id':p.player_id,'checked':True if p.rank <=num_players_to_qualify else False,'rank':p.rank} for p in ranked_players]
    jsonifyd_list = [{'player_id':p.player_id,'rank':p.rank} for p in ranked_players]
    
    return jsonify({'ranked_players':jsonifyd_list})

@App.route(api_ver+'/division/<division_id>/herb/players/ranked')
@fetch_entity(Division, 'division')
def get_players_ranked_by_qualifying_herb(division):
    #FIXME : should not be hardcoded    
    print "in herb"
    num_players_to_qualify = 24
    num_non_qualified_players = 100
    ranked_players = v1_utils.get_players_ranked_by_qualifying_herb(division.division_id,num_non_qualified_players)    
    #jsonifyd_list = [{'player_id':p.player_id,'checked':True if p.rank <=num_players_to_qualify else False,'rank':p.rank} for p in ranked_players]
    
    jsonifyd_list = [{'player_id':p[1]['player_id'],'rank':p[0]+1} for p in ranked_players]    
    return jsonify({'ranked_players':jsonifyd_list})

