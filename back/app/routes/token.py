import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Entry, Score, Player, Division, Machine, Token, Team, Metadivision, Tournament
from app import App, Admin_permission, Scorekeeper_permission, Void_permission, DB
from app.routes.util import fetch_entity, calculate_score_points_from_rank, get_division_from_metadivision
from app.routes import entry
from app import tom_config
from werkzeug.exceptions import Conflict, BadRequest

def get_existing_token_info(player_id=None,team_id=None,div_id=None,metadiv_id=None):
    query = None
    if div_id:
        query =  Token.query.filter_by(division_id=div_id)
    if metadiv_id:
        query = Token.query.filter_by(metadivision_id=metadiv_id)
    if player_id:
        query = query.filter_by(player_id=player_id)
    if team_id:
        query = query.filter_by(team_id=team_id)
    return query.count()

def check_linked_division(division_id, player_id=None, team_id=None):
    #FIXME : this should have actual contents
    pass
        
def check_add_token_for_max_tokens(num_tokens,div_id=None,metadiv_id=None,player_id=None,team_id=None):    
    #FIXME : need to take into account active entries
    if player_id:
        existing_token_count = get_existing_token_info(div_id=div_id,metadiv_id=metadiv_id,player_id=player_id)
    if team_id:
        existing_token_count = get_existing_token_info(div_id=div_id,team_id=team_id)
    if metadiv_id:
        existing_token_count = get_existing_token_info(metadiv_id=metadiv_id,player_id=player_id)        
    if int(num_tokens) + int(existing_token_count) > tom_config.max_unstarted_tokens:
        raise Conflict('Token add requested will push you over the max tokens for this division')


def check_player_valid_for_add_token_request(tokens_data):
    if tokens_data.has_key('player_id') is False:# and tokens_data.has_key('team_id') is None:
        raise BadRequest('No player_id specified')            
    
    if Player.query.filter_by(player_id=tokens_data['player_id']) is None:        
        raise BadRequest('Bad player_id specified')
    
def create_division_tokens(num_tokens,div_id=None,metadiv_id=None,player_id=None,team_id=None):
    tokens = []
    for token_num in range(0,int(num_tokens)):
        new_token = Token()
        if player_id:
            new_token.player_id=player_id                    
        if team_id:
            new_token.team_id=team_id
        if div_id:
            new_token.division_id = div_id
        if metadiv_id:
            new_token.metadivision_id = metadiv_id            
        DB.session.add(new_token)
        tokens.append(new_token)
    return tokens

@App.route('/token/teams/<player_id>', methods=['GET'])
def get_team_tokens_for_player(player_id):
    teams = Team.query.filter(Team.players.any(Player.player_id.__eq__(player_id))).all()    
    if len(teams) == 0:
        return jsonify({})
    print teams
    tokens = Token.query.filter_by(team_id=teams[0].team_id).all()
    token_dict = {'teams':{}}
    #FIXME : need only active divisions
    divisions = Division.query.all()
    for division in divisions:
        token_dict['teams'][division.division_id]=0
    for token in tokens:        
        if token.team_id != None:
            token_dict['teams'][token.division_id]=token_dict['teams'][token.division_id] + 1      
    return jsonify(token_dict)

@App.route('/token/player_id/<player_id>', methods=['GET'])
def get_tokens_for_player(player_id):
    tokens = Token.query.filter_by(player_id=player_id).all()
    token_dict = {'divisions':{},'metadivisions':{}}
    #FIXME : need only active divisions
    divisions = Division.query.all()
    tournaments = Tournament.query.all()
    metadivisions = Metadivision.query.all()
    # FIXME : should have seperate call for metadivisions
    for division in divisions:
        token_dict['divisions'][division.division_id]=0
    for metadivision in metadivisions:
        token_dict['metadivisions'][metadivision.metadivision_id]=0
    for token in tokens:        
        if token.division_id != None:
            token_dict['divisions'][token.division_id]=token_dict['divisions'][token.division_id] + 1      
        if token.metadivision_id != None:
            token_dict['metadivisions'][token.metadivision_id]=token_dict['metadivisions'][token.metadivision_id] + 1      
    return jsonify(token_dict)



@App.route('/token', methods=['POST'])
def add_token():
    tokens_data = json.loads(request.data)
    check_player_valid_for_add_token_request(tokens_data)    
    player_id = tokens_data['player_id']
    player = Player.query.filter_by(player_id=player_id).first()    
    if tokens_data.has_key('team_id'):
        team_id = tokens_data['team_id']
        team = Team.query.filter_by(team_id=team_id).first()
    else:
        team_id = None
    for div_id in tokens_data['divisions']:
        division=Division.query.filter_by(division_id=div_id).first()
        if division is None:
            raise BadRequest('Bad division specified for token create')
        num_tokens = tokens_data['divisions'][div_id]
        check_add_token_for_max_tokens(num_tokens,div_id=div_id,player_id=player_id)
        if num_tokens > 0:
            tokens = create_division_tokens(num_tokens,div_id=div_id,player_id=player_id)
            #if entry.shared_check_player_can_start_new_entry(player,division):
            #    entry.shared_create_active_entry(division,player=player)

    for div_id in tokens_data['teams']:
        division=Division.query.filter_by(division_id=div_id).first()
        if division is None:
            raise BadRequest('Bad division specified for token create')
        num_tokens = tokens_data['teams'][div_id]
        if num_tokens > 0 and team_id:
            check_add_token_for_max_tokens(num_tokens,div_id=div_id,team_id=team_id)
            tokens = create_division_tokens(num_tokens,div_id=div_id,team_id=team_id)
            #if entry.shared_check_team_can_start_new_entry(team,division):    
            #    entry.shared_create_active_entry(division,player=player)            

    for metadiv_id in tokens_data['metadivisions']:
        if Metadivision.query.filter_by(metadivision_id=metadiv_id) is None:
            raise BadRequest('Bad metadivision specified for token create')
        num_tokens = tokens_data['metadivisions'][metadiv_id]
        check_add_token_for_max_tokens(num_tokens,metadiv_id=metadiv_id,player_id=player_id)
        division = get_division_from_metadivision(metadiv_id)
        if division is None:
            raise BadRequest('No active divisions in metadivision')            
        if num_tokens > 0:
            tokens = create_division_tokens(num_tokens,metadiv_id=metadiv_id,player_id=player_id)
            #if entry.shared_check_player_can_start_new_entry(player,division):    
            #    entry.shared_create_active_entry(division,player=player)            
    
    DB.session.commit()
    
         
    return jsonify({})
