import json
import app
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Machine, Player, Entry, Score, Division, DivisionMachine, Team, Token, AuditLogEntry
from app import App, Admin_permission, Scorekeeper_permission, DB
from app.routes.util import fetch_entity, i_am_a_teapot
from app.routes import entry as route_entry
from app.routes import team as route_team
from werkzeug.exceptions import Conflict,ImATeapot
from app import tom_config
import time

@App.route('/machine/active', methods=['GET'])
def get_active_machines():
    """Get a list of all active division machines"""
    divisions = Division.query.all()
    active_machines = {}
    for division in divisions:
        for machine in division.machines:
            active_machines[machine.division_machine_id]=machine.to_dict_simple()
    return jsonify(active_machines)



@App.route('/divisionmachine/<divisionmachine_id>/team/<team_id>', methods=['PUT'])
@Scorekeeper_permission.require(403)
@login_required
@fetch_entity(DivisionMachine, 'divisionmachine')
@fetch_entity(Team, 'team')
def set_machine_team(divisionmachine, team): #killroy
    """
description: Mark a division_machine as being played by a specific team, and create new entry 
             if team has available tokens and no active entry
post data: 
    none
url params: 
    divisionmachine_id: int : id of division_machine being player
    team_id: int : id of team playing division_machine
returns:
    dict of updated division_machine
    """
    if team.division_machine:
        raise i_am_a_teapot('Team is already playing the machine %s !' % team.division_machine.machine.name,"^")    
    if divisionmachine.team_id or divisionmachine.player_id:
        raise i_am_a_teapot('%s is already in use !' % divisionmachine.machine.name,"^")                    
    team_entry = route_entry.shared_get_query_for_active_entries(team_id=team.team_id,div_id=divisionmachine.division_id).first()
    if team_entry is None:        
        if route_entry.shared_check_team_can_start_new_entry(team,divisionmachine.division) is False:                        
            raise i_am_a_teapot('Team does not have any entries',"^")
        route_entry.shared_create_active_entry(divisionmachine.division,team=team)
    team_entry = route_entry.shared_get_query_for_active_entries(team_id=team.team_id,div_id=divisionmachine.division_id).first()            
    already_played_count = len([score for score in team_entry.scores if score.division_machine_id == divisionmachine.division_machine_id])
    if already_played_count > 0:
        raise i_am_a_teapot('Can not play the same game twice in one ticket',"^")
    divisionmachine.team_id = team.team_id
    DB.session.commit()
    return jsonify(divisionmachine.to_dict_simple())


@App.route('/divisionmachine/<divisionmachine_id>/player/<player_id>', methods=['PUT'])
@Scorekeeper_permission.require(403)
@login_required
@fetch_entity(DivisionMachine, 'divisionmachine')
@fetch_entity(Player, 'player')
def set_machine_player(divisionmachine, player): #killroy
    """
description: Mark a division_machine as being played by a specific player, and create new entry 
             if player has available tokens and no active entry
post data: 
    none
url params: 
    divisionmachine_id: int : id of division_machine being player
    player_id: int : id of player playing division_machine
returns:
    dict of updated division_machine
    """
    if player.division_machine:
        raise i_am_a_teapot('Player already is playing the machine %s !' % player.division_machine.machine.name,"^")    
    if divisionmachine.player_id or divisionmachine.team_id:
        raise i_am_a_teapot('%s is already in use !' % divisionmachine.machine.name,"^")                
    player_entry = route_entry.shared_get_query_for_active_entries(player_id=player.player_id,div_id=divisionmachine.division_id).first()            
    if player_entry is None:        
        if route_entry.shared_check_player_can_start_new_entry(player,divisionmachine.division) is False:                        
            raise i_am_a_teapot('Player does not have any entries',"^")
        #route_entry.shared_create_active_entry(divisionmachine.division,player=player)
    player_entry = route_entry.shared_get_query_for_active_entries(player_id=player.player_id,div_id=divisionmachine.division_id).first()
    if player_entry:
        already_played_count = len([score for score in player_entry.scores if score.division_machine_id == divisionmachine.division_machine_id])
        if already_played_count > 0:
            raise i_am_a_teapot('Can not play the same game twice in one ticket',"^")
    divisionmachine.player_id = player.player_id
    DB.session.commit()    
    available_tokens = Token.query.filter_by(paid_for=True,player_id=player.player_id,division_id=divisionmachine.division_id).all()
    new_audit_log_entry = AuditLogEntry(type="start_game",
                                        timestamp=time.time(),
                                        player_id=player.player_id,
                                        division_id=divisionmachine.division_id,
                                        division_machine_id=divisionmachine.division_machine_id)
    if player_entry:
        new_audit_log_entry.entry_id = player_entry.entry_id
    if len(available_tokens) > 0:
         new_audit_log_entry.available_tokens = len(available_tokens)       
    DB.session.add(new_audit_log_entry)
    DB.session.commit()
    
    
    return jsonify(divisionmachine.to_dict_simple())

@App.route('/divisionmachine/<divisionmachine_id>/entry/<entry_id>/asshole', methods=['PUT'])
@Scorekeeper_permission.require(403)
@login_required
@fetch_entity(DivisionMachine, 'divisionmachine')
@fetch_entity(Entry, 'entry')
def declare_player_or_team_an_asshole(divisionmachine, entry):
    """
description: increment the "asshole count" for whoever is playing a specified entry and give them a score of 0
post data: 
    none
url params: 
    divisionmachine_id: int : id of division_machine asshole(s) was playing on 
    entry_id: int : id of current entry of asshole 
returns:
    empty dict
    """
    if entry.player is None and entry.team is None:
        BadRequest("Entry has no team or player associated with it.  This should not happen.")
    if entry.team:
        asshole = entry.team        
    #FIXME : should not be setting player in entry when it's a team entry
    if entry.player is not None and entry.team is None:        
        asshole = entry.player        

    if asshole.division_machine is None:
        raise Conflict('Asshole is not playing any machines !')                
    if asshole.division_machine.division_machine_id != divisionmachine.division_machine_id:
        raise Conflict('Asshole is not playing machine %s !' % (divisionmachine.machine.name))
    divisionmachine.player_id = None
    divisionmachine.team_id = None
    if entry.team:
        asshole_players = entry.team.players
    if entry.player:
        asshole_players = [entry.player]
    for player in asshole_players:
        if player.player_is_an_asshole_count is None:
            player.player_is_an_asshole_count=0        
        player.player_is_an_asshole_count=player.player_is_an_asshole_count+1
    route_entry.add_score(entry,divisionmachine,0)    
    DB.session.commit()
    division = Division.query.filter_by(division_id=divisionmachine.division_id).first()
    if len(entry.scores) >= division.number_of_scores_per_entry:
        entry.active=False
        entry.voided=True
    DB.session.commit()
    return jsonify({})


@App.route('/divisionmachine/<divisionmachine_id>/player/<player_id>/clear', methods=['PUT'])
@Scorekeeper_permission.require(403)
@login_required
@fetch_entity(DivisionMachine, 'divisionmachine')
@fetch_entity(Player, 'player')
def clear_machine_player(divisionmachine, player): #killroy
    """
description: Mark a division_machine as not being played (by clearing the played_id from the division_machine)
post data: 
    none
url params: 
    divisionmachine_id: int : id of division_machine being player
    player_id: int : id of player playing division_machine
returns:
    empty dict
    """ 
    if player.division_machine is None:
        raise Conflict('Player %s is not playing machine %s !' % (player.player_id,divisionmachine.machine.name))                
    if player.division_machine.division_machine_id != divisionmachine.division_machine_id:
        raise Conflict('Player %s is not playing machine %s !' % (player.player_id,divisionmachine.machine.name))
    divisionmachine.player_id = None
    DB.session.commit()
    new_audit_log_entry = AuditLogEntry(type="undo_remove_player",
                                        timestamp=time.time(),
                                        player_id=player.player_id,                                                                                
                                        division_machine_id=divisionmachine.division_machine_id)
    DB.session.add(new_audit_log_entry)
    DB.session.commit()            
    return jsonify({})

@App.route('/divisionmachine/<divisionmachine_id>/team/<team_id>/clear', methods=['PUT'])
@Scorekeeper_permission.require(403)
@login_required
@fetch_entity(DivisionMachine, 'divisionmachine')
@fetch_entity(Team, 'team')
def clear_machine_team(divisionmachine, team): #killroy
    """
description: Mark a division_machine as not being played (by clearing the team_id from the division_machine)
post data: 
    none
url params: 
    divisionmachine_id: int : id of division_machine being played
    team_id: int : id of team playing division_machine
returns:
    empty dict
    """ 
    if team.division_machine is None:
        raise Conflict('Team %s is not playing machine %s !' % (team.team_name,divisionmachine.machine.name))                
    if team.division_machine.division_machine_id != divisionmachine.division_machine_id:
        raise Conflict('Team %s is not playing machine %s !' % (team.team_name,divisionmachine.machine.name))
    divisionmachine.team_id = None
    DB.session.commit()
    
    return jsonify({})



@App.route('/machine/<divisionmachine_id>/rankings', methods=['GET'])
@fetch_entity(DivisionMachine, 'divisionmachine')
def get_machine_rankings(divisionmachine):
    division_machine_scores = Score.query.filter_by(division_machine_id=divisionmachine.division_machine_id).join(Entry,Score.entry).filter_by(voided=False,completed=True).order_by(Score.rank.asc()).limit(200)
    division_machine_scores_list = []
    for division_machine_score in division_machine_scores:
        division_machine_scores_list.append(division_machine_score.to_dict_simple())
    return jsonify({'rankings':division_machine_scores_list})

@App.route('/divisionmachine/<divisionmachine_id>', methods=['GET'])
@fetch_entity(DivisionMachine, 'divisionmachine')
def get_division_machine(divisionmachine):
    """
description: get a specific division_machine
post data: 
    none
url params: 
    divisionmachine_id: int : id of division_machine to return    
returns:
    dict of division_machine requested
    """  
    return jsonify(divisionmachine.to_dict_simple())
