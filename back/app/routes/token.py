import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Entry, Score, Player, Division, Machine, Token, Team, Metadivision
from app import App, Admin_permission, Scorekeeper_permission, Void_permission, DB
from app.routes.util import fetch_entity, calculate_score_points_from_rank
from app import tom_config
from werkzeug.exceptions import Conflict, BadRequest

def get_existing_token_info(jsontoken,player_id=None,team_id=None):
    query = None
    if jsontoken.has_key('division_id'):
        query =  Token.query.filter_by(division_id=jsontoken['division_id'])
    if jsontoken.has_key('metadivision_id'):
        query = Token.query.filter_by(division_id=jsontoken['metadivision_id'])
    if player_id:
        query = query.filter_by(player_id=player_id)
    if team_id:
        query = query.filter_by(team_id=team_id)
    jsontoken['existing_tokens_for_division'] = query.count()
    return jsontoken

def check_division_metadivision_valid_for_add_token_request(jsontoken,player_id=None,team_id=None):
    
    if player_id:
        jsontoken = get_existing_token_info(jsontoken,player_id=player_id)
    if team_id:
        jsontoken = get_existing_token_info(jsontoken,team_id=team_id)

    if int(jsontoken['num_tokens']) + int(jsontoken['existing_tokens_for_division']) > tom_config.max_unstarted_tokens:
        raise Conflict('Token add requested will push you over the max tokens for this division')

    if jsontoken.has_key('division_id') is None and jsontoken.has_key('metadivision_id') is None:
        raise BadRequest('No division or metadivision specified for token create')

    if jsontoken.has_key('division_id') and Division.query.filter_by(division_id=jsontoken['division_id']) is None:
        raise BadRequest('Bad division specified for token create')            

    if jsontoken.has_key('metadivision_id') and Division.query.filter_by(metadivision_id=jsontoken['metadivision_id']) is None:
        raise BadRequest('Bad metadivision specified for token create')            
        

def check_players_teams_valid_for_add_token_request(tokens_data):
    if tokens_data.has_key('player_id') is None and tokens_data.has_key('team_id') is None:
        raise BadRequest('No team_id or player_id specified')            
    
    if tokens_data.has_key('player_id') and Player.query.filter_by(player_id=tokens_data['player_id']) is None:        
        raise BadRequest('Bad player_id specified')
    
    if tokens_data.has_key('team_id') and Team.query.filter_by(team_id=tokens_data['team_id']) is None:        
        raise BadRequest('Bad team_id specified')

def create_tokens(jsontoken,player_id=None,team_id=None):
    tokens = []
    for token_num in range(0,int(jsontoken['num_tokens'])):
        new_token = Token()
        if player_id:
            new_token.player_id=player_id                    
        if team_id:
            new_token.team_id=team_id
        if jsontoken.has_key('division_id'):
            new_token.division_id = jsontoken['division_id']
        if jsontoken.has_key('metadivision_id'):
            new_token.metadivision_id = jsontoken['metadivision_id']                
        DB.session.add(new_token)
        tokens.append(new_token)
    return tokens

def create_entry_if_needed(jsontoken,token,player_id=None,team_id=None):
    if jsontoken.has_key('division_id'):
        division_id = jsontoken['division_id']
        metadivision_id = None
    if jsontoken.has_key('metadivision_id'):
        metadivision_id = jsontoken['metadivision_id']
        division_id = None
        
    if player_id:
        query = Entry.query.filter_by(division_id=division_id,player_id=player_id,active=True)
    if team_id:
        query = Entry.query.filter_by(division_id=division_id,team_id=team_id,active=True)        
    if query.count() > 0:
        return
    if metadivision_id:
        # WE ASSUME ONLY ONE DIVISION IN A METADIVISION IS ACTIVE AT ONCE
        division = Division.query.filter_by(metadivision_id=metadivision_id,active=True).first()
    if division_id:
        division = Division.query.filter_by(division_id=division_id).first()    

    new_entry = Entry(
        division = division,
        active = True,
        completed = False,
        refresh = False,
        voided = False,
        number_of_scores_per_entry = division.number_of_scores_per_entry
    )

    if player_id:
        new_entry.player_id = player_id
    if team_id:
        new_entry.team_id = team_id        

    DB.session.add(new_entry)
    Token.query.filter_by(token_id=token.token_id).delete()
    DB.session.commit()
        
@App.route('/token', methods=['POST'])
def add_token():
    tokens_data = json.loads(request.data)    
    check_players_teams_valid_for_add_token_request(tokens_data)
    if tokens_data.has_key('player_id'):
        player_id = tokens_data['player_id']
        team_id = None

    if tokens_data.has_key('team_id'):
        team_id = tokens_data['team_id']
        player_id = None

    #FIXME : check that each tokens_data['tokens'] is in a seprate division
    for jsontoken in tokens_data['tokens']:

        if player_id:
            jsontoken = get_existing_token_info(jsontoken,player_id=player_id)
            check_division_metadivision_valid_for_add_token_request(jsontoken,player_id=player_id)            
            tokens = create_tokens(jsontoken,player_id=player_id)
            create_entry_if_needed(jsontoken, tokens.pop(), player_id=player_id)
        if team_id:
            jsontoken = get_existing_token_info(jsontoken,team_id=team_id)
            check_division_metadivision_valid_for_add_token_request(jsontoken,team_id=team_id)        
            tokens = create_tokens(jsontoken,team_id=team_id)
            create_entry_if_needed(jsontoken, tokens.pop(), team_id=team_id)            
    DB.session.commit()
    
         
    return jsonify({})
