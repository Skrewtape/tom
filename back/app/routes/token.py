import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Entry, Score, Player, Division, Machine, Token, Team, Metadivision, Tournament,CompToken, AuditLogEntry
from app import App, Admin_permission, Scorekeeper_permission, Void_permission, DB
from app.routes.util import fetch_entity, calculate_score_points_from_rank, get_division_from_metadivision
from app.routes import entry
from app import tom_config
from werkzeug.exceptions import Conflict, BadRequest
from flask_login import current_user
from flask_restless.helpers import to_dict
import time

def get_existing_token_info(player_id=None,team_id=None,div_id=None,metadiv_id=None):
    query = None
    if div_id:
        query =  Token.query.filter_by(division_id=div_id,paid_for=True)
    if metadiv_id:
        query = Token.query.filter_by(metadivision_id=metadiv_id,paid_for=True)
    if player_id:
        query = query.filter_by(player_id=player_id)
    if team_id:
        query = query.filter_by(team_id=team_id)
    return query.count()

def check_linked_division(division_id, player_id=None, team_id=None):
    #FIXME : this should have actual contents
    pass
        
def check_add_token_for_max_tokens(num_tokens,div_id,metadiv_id=None,player_id=None,team_id=None):        
    if player_id:
        existing_token_count = get_existing_token_info(div_id=div_id,metadiv_id=metadiv_id,player_id=player_id)
        active_entry_count=Entry.query.filter_by(division_id=div_id,active=True,player_id=player_id).count()        
    if team_id:
        existing_token_count = get_existing_token_info(div_id=div_id,team_id=team_id)
        active_entry_count=Entry.query.filter_by(division_id=div_id,active=True,team_id=team_id).count()        
    if metadiv_id:
        existing_token_count = get_existing_token_info(metadiv_id=metadiv_id,player_id=player_id)
        #FIXME : we assume metadivisions are not also team divisions
        active_entry_count=Entry.query.filter_by(division_id=div_id,active=True,player_id=player_id).count()        
    if int(num_tokens) + int(existing_token_count) + active_entry_count > tom_config.max_unstarted_tokens:
        raise Conflict('Token add requested will push you over the max tokens for this division')


def check_player_valid_for_add_token_request(tokens_data):
    if tokens_data.has_key('player_id') is False:
        raise BadRequest('No player_id specified')            
    
    if Player.query.filter_by(player_id=tokens_data['player_id']) is None:        
        raise BadRequest('Bad player_id specified')
    
def create_division_tokens(num_tokens,div_id=None,metadiv_id=None,player_id=None,team_id=None, paid_for=1, comped=False):
    tokens = []
    json_tokens = []
    for token_num in range(0,int(num_tokens)):
        #token_log = {'type':'token_create','timestamp':time.time(),'player_id':player_id,'team_id':team_id,'metadiv_id':metadiv_id,'div_id':div_id,'paid_for':paid_for,'comped':comped}                                                
        new_token = Token()    
        if player_id:
            new_token.player_id=player_id                    
        if team_id:
            new_token.team_id=team_id
        if div_id:
            new_token.division_id = div_id
        if metadiv_id:
            new_token.metadivision_id = metadiv_id
        new_token.paid_for = True if paid_for == 1 else False
        DB.session.add(new_token)        
        if comped:            
            new_comped_token = CompToken()
            if div_id:
                new_comped_token.division_id=div_id
            if metadiv_id:
                new_comped_token.metadivision_id=metadiv_id
            DB.session.add(new_comped_token)
        DB.session.commit()
        #token_log['token_id']=new_token.token_id
        #App.logger.info(json.dumps(token_log)+",")
        available_tokens = Token.query.filter_by(paid_for=True,player_id=player_id,division_id=div_id).all()                
        new_audit_log_entry = AuditLogEntry(type="token create",
                                            timestamp=time.time(),                                            
                                            player_id=player_id,
                                            division_id=div_id,
                                            metadivision_id=metadiv_id,                                            
                                            paid_for=paid_for,
                                            comped=comped,
                                            available_tokens=len(available_tokens),
                                            token_id=new_token.token_id)
        DB.session.add(new_audit_log_entry)
        DB.session.commit()        
        
        tokens.append(to_dict(new_token))
    return tokens

@App.route('/token/teams/<player_id>', methods=['GET'])
@fetch_entity(Player, 'player')
def get_team_tokens_for_player(player):
    """
description: Get list of of all tokens for a team (that player is part of)
post data: 
    none
url params: 
    player_id: int : id of player to retrieve team tokens for
returns:
    dict of all team tokens
    dict key is "teams".  value is a dict - the key is a division_id, value is number of tokens for player team or 0 if none 
    """
    token_dict = {'teams':{}}    
    team = Team.query.filter(Team.players.any(Player.player_id.__eq__(player.player_id))).first()    
    if team is None:
        return jsonify(token_dict)    
    tokens = Token.query.filter_by(team_id=team.team_id,paid_for=True).all()
    
    #FIXME : need only active divisions
    divisions = Division.query.all()
    for division in divisions:
        token_dict['teams'][division.division_id]=0
    for token in tokens:        
        if token.team_id != None:
            token_dict['teams'][token.division_id]=token_dict['teams'][token.division_id] + 1      
    return jsonify(token_dict)

@App.route('/token/player_id/<player_id>', methods=['GET'])
@fetch_entity(Player, 'player')
def get_tokens_for_player(player):
    """
description: Get list of of all tokens for a player 
post data: 
    none
url params: 
    player_id: int : id of player to retrieve tokens for
returns:
    dict of all player tokens
    dict key is "divisions" and "metadivisions".  values are dicts - the key is a division_id/metadivision_id, value is number of tokens for player in that division/metadivision or 0 if none 
    """    
    tokens = Token.query.filter_by(player_id=player.player_id, paid_for=True).all()
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

@App.route('/token/confirm_paid_for', methods=['PUT'])
@login_required
def confirm_tokens():
    tokens_data = json.loads(request.data)['total_tokens']
    for token in tokens_data:
        token = Token.query.filter_by(token_id=token['token_id'],paid_for=False).first()
        if token:
            token.paid_for=True
            DB.session.commit()
            #token_log = {'type':'credit_card_purchase_confirmed','timestamp':time.time(),'token_id':token.token_id}            
            #App.logger.info(json.dumps(token_log)+",")
            new_audit_log_entry = AuditLogEntry(type="credit_card_purchase_confirmed",
                                                timestamp=time.time(),                                            
                                                token_id=new_token.token_id)
        DB.session.add(new_audit_log_entry)
        DB.session.commit()        
            
    return jsonify({})

@App.route('/token/paid_for/<int:paid_for>', methods=['POST'])
@login_required
def add_token(paid_for):
    """
description: Add a token for a player or team
post data: 
    player_id: int : id of player to add token for
    team_id: int : (optional) id of team to add token for
    divisions: dict : Key is division id.   Value is number of tokens requested for that division, or 0 if none
    metadivisions: dict : Key is metadivision id.  Value is number of tokens requested for that metadivision, or 0 if none
    teams: dict : Key is division id.  Value is number of tokens requested for that division for team specified by team_id, or 0 if none
url params: 
    none
returns:
    empty dict
    """
    total_tokens=[]
    tokens_data = json.loads(request.data)
    check_player_valid_for_add_token_request(tokens_data)    
    player_id = tokens_data['player_id']
    comped = tokens_data['comped']
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
            tokens = create_division_tokens(num_tokens,div_id=div_id,player_id=player_id, paid_for=paid_for,comped=comped)
            total_tokens = total_tokens + tokens
    for div_id in tokens_data['teams']:
        division=Division.query.filter_by(division_id=div_id).first()
        if division is None:
            raise BadRequest('Bad division specified for token create')
        num_tokens = tokens_data['teams'][div_id]
        if num_tokens > 0 and team_id:
            check_add_token_for_max_tokens(num_tokens,div_id=div_id,team_id=team_id)
            tokens = create_division_tokens(num_tokens,div_id=div_id,team_id=team_id,paid_for=paid_for,comped=comped)
            total_tokens = total_tokens + tokens
    for metadiv_id in tokens_data['metadivisions']:
        if Metadivision.query.filter_by(metadivision_id=metadiv_id) is None:
            raise BadRequest('Bad metadivision specified for token create')
        num_tokens = tokens_data['metadivisions'][metadiv_id]
        division = get_division_from_metadivision(metadiv_id)
        if division is None:
            raise BadRequest('No active divisions in metadivision')                    
        check_add_token_for_max_tokens(num_tokens,div_id=division.division_id,metadiv_id=metadiv_id,player_id=player_id)
        if num_tokens > 0:
            tokens = create_division_tokens(num_tokens,metadiv_id=metadiv_id,player_id=player_id, paid_for=paid_for,comped=comped)
            total_tokens = total_tokens + tokens
    DB.session.commit()
    
         
    return jsonify({'total_tokens':total_tokens})
