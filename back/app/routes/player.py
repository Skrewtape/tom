import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Player, Division, Entry, Score
from app import App, Admin_permission, Desk_permission, DB
from app.routes.util import fetch_entity
from werkzeug.exceptions import Conflict


@App.route('/player/rank', methods=['GET'])
def calculate_ranks():
    DB.engine.execute('UPDATE entry set score=0')    
    max_rank = 100
    for division in Division.query.all():
        machines = division.machines    
        machine_rankings = {}
        for machine in machines:
            machine_scores=Score.query.filter_by(machine_id=machine.machine_id).join(Entry, Score.entry).filter_by(division_id=division.division_id,completed=True,voided=False).order_by(Score.score.desc()).limit(max_rank)
            rank = 1
            for score in machine_scores:
                score.rank = rank            
                point_for_entry = max_rank+1-rank
                if point_for_entry < 0:
                    point_for_entry = 0
                if score.entry.score:
                    score.entry.score=score.entry.score+point_for_entry
                else:
                    score.entry.score=point_for_entry
                rank = rank + 1
        rank = 0
                
        machine_entries=Entry.query.filter_by(division_id=division.division_id,completed=True).order_by(Entry.score.desc()).limit(150)
        for entry in machine_entries:            
            rank = rank + 1
            entry.rank = rank
    DB.session.commit()    

    return jsonify()


@App.route('/player', methods=['GET'])
def get_players():
    """Get a list of players"""
    return jsonify(players=[
        p.to_dict_simple() for p in
        Player.query.order_by(Player.first_name.asc(), Player.last_name.asc()).all()
    ])


@App.route('/player', methods=['POST'])
@login_required
@Desk_permission.require(403)
def add_player():
    """Add a player"""
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
        new_player.linked_division.append(division)
    DB.session.add(new_player)
    DB.session.commit()
    return jsonify(new_player.to_dict_simple())

def linked_divisions_to_dict(linked_divisions):
    if len(linked_divisions) == 0:
        return None
    if len(linked_divisions) == 1:
        return [linked_divisions[0].to_dict_simple()]
    return [x.to_dict_simple() for x in linked_divisions]
    

@App.route('/player/<player_id>', methods=['GET'])
@fetch_entity(Player, 'player')
def get_player(player):
    """Get a list of players"""
    player_dict = player.to_dict_simple()
    player_dict['linked_division'] = linked_divisions_to_dict(player.linked_division)                
    return jsonify(player_dict)


@App.route('/player/<player_id>', methods=['PUT'])
@login_required
@Desk_permission.require(403)
@fetch_entity(Player, 'player')
def edit_player(player):
    """edit a player"""
    player_data = json.loads(request.data)    
    if 'first_name' in player_data:
        player.first_name=player_data['first_name']
    if 'last_name' in player_data:
        player.last_name=player_data['last_name']
    if 'email' in player_data:
        player.email=player_data['email']        

    player_dict = player.to_dict_simple()
    
    if 'linked_division' in player_data:
        #FIXME : add busniess logic to prevent moving down a division
        old_division = None
        new_division = Division.query.filter_by(division_id=player_data['linked_division']).first()        
        if new_division is None:            
            #FIXME : need to make sure this actually works
            raise BadRequest('Bad division specified for linked division')            
        linked_divisions_in_tournament = [x for x in player.linked_division
                                          if x.tournament_id == new_division.tournament_id]
        if linked_divisions_in_tournament:            
            old_division = linked_divisions_in_tournament[0]
            if old_division.name < new_division.name:                
                raise Conflict('Tried to specify a lower division than current division')
            player.linked_division.remove(linked_divisions_in_tournament[0])            
        player.linked_division.append(new_division)
        if old_division is not None:
            for entry in Entry.query.filter_by(player_id=player.player_id,
                                               division_id=old_division.division_id).all(): 
                entry.voided = True                                
        player_dict['linked_division'] = linked_divisions_to_dict(player.linked_division)            
    DB.session.commit()
    return jsonify(player_dict)

@App.route('/player/<player_id>/entry/all', methods=['GET'])
@fetch_entity(Player, 'player')
def get_all_player_entries(player):
    """Get a list of all entries for a player"""
    entries = Entry.query.filter_by(player_id=player.player_id).all()        
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

@App.route('/player/<player_id>/entry/active', methods=['GET'])
@login_required
@fetch_entity(Player, 'player')
def get_active_player_entries(player):
    """Get a list of open(i.e. not completed, not voided) entries for a player"""
    print "hi there"
    entries = Entry.query.filter_by(player_id=player.player_id,completed=False,voided=False,active=True).all()        
    entries_grouped_dict = {}
    for entry in entries:
        if entry.division_id not in entries_grouped_dict:
            entries_grouped_dict[entry.division_id]={}
        entries_grouped_dict[entry.division_id][entry.entry_id]=entry.to_dict_with_scores()
    return jsonify(entries_grouped_dict)
