import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Player, Division, Entry, Score, Tournament, Team
from app import App, Admin_permission, Desk_permission, DB
from app.routes.util import fetch_entity, calculate_score_points_from_rank
from werkzeug.exceptions import Conflict
from flask_restless.helpers import to_dict
    
@App.route('/player', methods=['GET'])
def get_players():
    """Get a list of players"""
    return jsonify(players=[
        #p.to_dict_simple() for p in
        p.to_dict_with_team() for p in
        Player.query.order_by(Player.first_name.asc(), Player.last_name.asc()).all()
    ])

@App.route('/player/asshole', methods=['GET'])
def get_asshole_players():
    """Get a list of asshole players"""
    return jsonify(asshole_players=[
        p.to_dict_simple() for p in
        Player.query.filter(Player.player_is_an_asshole_count > 0).order_by(Player.first_name.asc(), Player.last_name.asc()).all()
    ])


@App.route('/player/latest_players/<num_players>', methods=['GET'])
def get_latest_players(num_players):
    """Get a list of latest 10 players"""
    return jsonify(players=[
        p.to_dict_simple() for p in
        Player.query.order_by(Player.player_id.desc()).limit(int(num_players))
    ])


@App.route('/player', methods=['POST'])
@login_required
@Desk_permission.require(403)
def add_player():
    """
description: Add a Player
post data: 
    first_name: string : first name of new player 
    last_name: string : last name of new player
    email: string : (optional) email address of new player
    linked_division : int : division id of main tournament division 
url params: 
    none
returns:
    new player
    """
    player_data = json.loads(request.data)
    new_player = Player(
        first_name = player_data['first_name'],
        last_name = player_data['last_name'],        
        search_name = "".join(
            player_data[field].lower() for field in ['first_name', 'last_name']
        )                
    )
    if 'email' in player_data:
        new_player.email = player_data['email']
    if 'linked_division' in player_data:
        division = Division.query.filter_by(division_id=player_data['linked_division']).first()
        if division is None:
            raise BadRequest('Bad division specified')            
        new_player.linked_division.append(division)
    DB.session.add(new_player)
    DB.session.commit()
    return jsonify(new_player.to_dict_simple())

def linked_divisions_to_dict(linked_divisions):
    if len(linked_divisions) == 0:
        return None
    if len(linked_divisions) == 1:
        return linked_divisions[0].to_dict_simple()
    return [x.to_dict_simple() for x in linked_divisions]
    

@App.route('/player/<player_id>', methods=['GET'])
@fetch_entity(Player, 'player')
def get_player(player):
    """
description: Get a specific Player
post data: 
    none
url params: 
    player_id: int :id of player to retrieve
returns:
    dict of player requested
    """
    player_dict = player.to_dict_with_team()
    #FIXME : this should be in the model
    player_dict['linked_division'] = linked_divisions_to_dict(player.linked_division)
    if player.division_machine:
        player_dict['division_machine'] = player.division_machine.to_dict_simple()                
    return jsonify(player_dict)


def find_linked_division_with_tournament_id(player, tournament_id):
    for x in player.linked_division:
        if x.tournament_id == tournament_id:
            return x

def check_old_division_can_be_removed(old_division,new_division):
    if old_division and old_division.name < new_division.name:                
        raise Conflict('Tried to specify a lower division than current division')
    
def void_entrys_from_old_linked_division(player,old_division):
    if old_division is not None:
        for entry in Entry.query.filter_by(player_id=player.player_id, division_id=old_division.division_id).all(): 
            entry.voided = True
        DB.session.commit()

@App.route('/player/<player_id>', methods=['PUT'])
@login_required
@Desk_permission.require(403)
@fetch_entity(Player, 'player')
def edit_player(player):
    """
description: Edit a player
post data: 
    first_name: string : (optional) player first name
    last_name: string : (optional) player last name
    email: string : (optional) player email address
    division_id: int : (optional) division id of linked main division
url params: 
    none
returns:
    edited player
notes:
    if a new division_id is specified, and there was an existing one,
    this will trigger all entries associated with the old division_id 
    to be marked as voided
    """
    player_data = json.loads(request.data)    
    if 'first_name' in player_data:
        player.first_name=player_data['first_name']
    if 'last_name' in player_data:
        player.last_name=player_data['last_name']
    if 'email' in player_data:
        player.email=player_data['email']        

    player_dict = player.to_dict_simple()
    
    if 'division_id' in player_data:
        #FIXME : be able to handle multiple tourneys with multiple divisions
        old_division = None
        new_division = Division.query.filter_by(division_id=player_data['division_id']).first()        

        if new_division is None:            
            raise BadRequest('Bad division specified for linked division')            

        new_tournament_id = new_division.tournament_id
        old_division = find_linked_division_with_tournament_id(player, new_tournament_id)
        check_old_division_can_be_removed(old_division,new_division)
        player.linked_division.append(new_division)
        if old_division:
            player.linked_division.remove(old_division)                                
        void_entrys_from_old_linked_division(player,old_division)        
        player_dict['linked_division'] = linked_divisions_to_dict(player.linked_division)            

    DB.session.commit()
    return jsonify(player_dict)

@App.route('/player/<player_id>/entry/all', methods=['GET'])
@fetch_entity(Player, 'player')
def get_all_player_entries(player):
    """Get a list of all entries for a player ( including voided and in progress entries )"""
    entries = Entry.query.filter_by(player_id=player.player_id).all()        
    entries_grouped_dict = {}
    for entry in entries:
        if entry.division_id not in entries_grouped_dict:
            entries_grouped_dict[entry.division_id]={}
        entries_grouped_dict[entry.division_id][entry.entry_id]=entry.to_dict_with_scores()
    return jsonify(entries_grouped_dict)


@App.route('/player/<player_id>/entry', methods=['GET'])
@fetch_entity(Player, 'player')
def get_most_player_entries(player):
    """Get a list of all entries for a player ( excluding voided and in progress entries )"""
    entries = Entry.query.filter_by(player_id=player.player_id, completed=True, voided=False).all()        
    entries_grouped_dict = {}
    for entry in entries:
        if entry.division_id not in entries_grouped_dict:
            entries_grouped_dict[entry.division_id]={}
        entries_grouped_dict[entry.division_id][entry.entry_id]=entry.to_dict_with_scores()
    return jsonify(entries_grouped_dict)

@App.route('/player/<player_id>/entry/open', methods=['GET'])
@login_required
@fetch_entity(Player, 'player')
def get_open_player_entries(player):
    """Get a list of open(i.e. not completed, not voided) entries for a player"""
    print "hi there"
    entries = Entry.query.filter_by(player_id=player.player_id,completed=False,voided=False).all()        
    entries_grouped_dict = {}
    for entry in entries:
        if entry.division_id not in entries_grouped_dict:
            entries_grouped_dict[entry.division_id]={}
        entries_grouped_dict[entry.division_id][entry.entry_id]=entry.to_dict_with_scores()
    return jsonify(entries_grouped_dict)

@App.route('/player/<player_id>/entry/unstarted', methods=['GET'])
@fetch_entity(Player, 'player')
def get_unstarted_player_entries(player):
    """Get a list of unstarted(i.e. not active, not completed, not voided) entries for a player"""
    print "hi there"
    entries = Entry.query.filter_by(player_id=player.player_id,completed=False,voided=False,active=False).all()        
    entries_grouped_dict = {}
    for entry in entries:
        if entry.division_id not in entries_grouped_dict:
            entries_grouped_dict[entry.division_id]={}
        entries_grouped_dict[entry.division_id][entry.entry_id]=entry.to_dict_with_scores()
    return jsonify(entries_grouped_dict)


@Admin_permission.require(403)
@App.route('/player/<player_id>/deactivate', methods=['PUT'])
@fetch_entity(Player, 'player')
def deactivate_player(player):
    """Bad player! No cookie!"""
    player.active=False
    DB.session.commit()        
    return jsonify(player.to_dict_simple())

@App.route('/player/<player_id>/entry/active', methods=['GET'])
@fetch_entity(Player, 'player')
def get_active_player_entries(player):
    """
description: Get a list of active(i.e. not completed, not voided) entries for a player
post data: 
    none
url params:     
    player_id: int : id of player to get entries for
returns:
    dict of active entries for player.
    key for dict is division id.  value is a dict with a key of an entry_id, value of dict of entry   
    """     
    entries = Entry.query.filter_by(player_id=player.player_id,completed=False,voided=False,active=True).all()
    #FIXME : should only get active divisions
    divisions = Division.query.all()
    entries_grouped_dict = {}
    for division in divisions:
        entries_grouped_dict[division.division_id]={}
    for entry in entries:
        if entry.division_id not in entries_grouped_dict:
            #FIXME : you can only have one active entry per division, so no need for this to be a dict
            entries_grouped_dict[entry.division_id]={}
        entries_grouped_dict[entry.division_id][entry.entry_id]=entry.to_dict_with_scores()
    return jsonify(entries_grouped_dict)

@App.route('/player/<player_id>/entry/active_count', methods=['GET'])
@fetch_entity(Player, 'player')
def get_active_player_entries_count(player):
    """
description: Get all active (i.e. not voided, not completed) entries for a given player (including team entries)
post data: 
    none
url params: 
    player_id: int : id of player to retreive entries for 
returns:
    dict of all active entries for player
    dict key is division id.  value is 1 if there is an active entry for division, or 0 if there is no active entry for division
    """
    entries = Entry.query.filter_by(player_id=player.player_id,completed=False,voided=False,active=True).all()
    #FIXME : this should be able to handle multiple teams    
    team = Team.query.filter(Team.players.any(Player.player_id.__eq__(player.player_id))).first()
    if team:
        team_entries = Entry.query.filter_by(team_id=team.team_id,completed=False,voided=False,active=True).all()
    else:
        team_entries = []
    #FIXME : should only get active divisions
    divisions = Division.query.all()
    entries_grouped_dict = {}
    for division in divisions:
        entries_grouped_dict[division.division_id]=0
    for entry in entries:
        entries_grouped_dict[entry.division_id] = 1
    for entry in team_entries:
        entries_grouped_dict[entry.division_id] = 1
        
    return jsonify(entries_grouped_dict)

#Guyh - need to remove all the team stuff from this?
@App.route('/player/<player_id>/division/<division_id>/entry/active', methods=['GET'])
@fetch_entity(Player, 'player')
@fetch_entity(Division, 'division')
def get_active_player_entry(player,division):
    """Get a list of open(i.e. not completed, not voided) entries for a player"""
    entries = Entry.query.filter_by(division_id=division.division_id,player_id=player.player_id,completed=False,voided=False,active=True).all()
    teams = Team.query.filter(Team.players.any(Player.player_id.__eq__(player.player_id))).all()
    if len(teams) > 0:        
        team_entries = Entry.query.filter_by(division_id=division.division_id,team_id=teams[0].team_id,completed=False,voided=False,active=True).all()
    else:
        team_entries = []
    #FIXME : should only get active divisions
    divisions = Division.query.all()
    entries_grouped_dict = {}
    entry_id=None
    for entry in entries:
        if entry.division_id == division.division_id:
            matched_entry = entry
    for entry in team_entries:
        if entry.division_id == division.division_id:
            matched_entry = entry
        
    return jsonify({'entry':matched_entry.to_dict_with_scores()})

