import json
import app
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Machine, Player, Entry, Score, Division, DivisionMachine, Team
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity, i_am_a_teapot
from app.routes import entry as route_entry
from app.routes import team as route_team
from werkzeug.exceptions import Conflict,ImATeapot
from app import tom_config

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
@login_required
@fetch_entity(DivisionMachine, 'divisionmachine')
@fetch_entity(Team, 'team')
def set_machine_team(divisionmachine, team):
    """claim a machine for a team - its mine - ARRRRR"""
    if team.division_machine:
        raise i_am_a_teapot('Team is already playing the machine %s !' % team.division_machine.machine.name,"^")    
    if divisionmachine.team_id or divisionmachine.player_id:
        raise i_am_a_teapot('%s is already in use !' % divisionmachine.machine.name,"^")                    
    team_entry = route_entry.shared_get_query_for_active_entries(team_id=team.team_id,div_id=divisionmachine.division_id).first()
    if team_entry is None:        
        if route_entry.shared_check_team_can_start_new_entry(team,divisionmachine.division) is False:            
            #FIXME : goto_state should be handled on the client side, but I'm being lazy
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
@login_required
@fetch_entity(DivisionMachine, 'divisionmachine')
@fetch_entity(Player, 'player')
def set_machine_player(divisionmachine, player):
    """claim a machine for a player - its mine - ARRRRR"""
    if player.division_machine:
        raise i_am_a_teapot('Player already is playing the machine %s !' % player.division_machine.machine.name,"^")    
    if divisionmachine.player_id or divisionmachine.team_id:
        raise i_am_a_teapot('%s is already in use !' % divisionmachine.machine.name,"^")                
    player_entry = route_entry.shared_get_query_for_active_entries(player_id=player.player_id,div_id=divisionmachine.division_id).first()            
    if player_entry is None:        
        if route_entry.shared_check_player_can_start_new_entry(player,divisionmachine.division) is False:            
            #FIXME : goto_state should be handled on the client side, but I'm being lazy
            raise i_am_a_teapot('Player does not have any entries',"^")
        route_entry.shared_create_active_entry(divisionmachine.division,player=player)
    player_entry = route_entry.shared_get_query_for_active_entries(player_id=player.player_id,div_id=divisionmachine.division_id).first()
            
    already_played_count = len([score for score in player_entry.scores if score.division_machine_id == divisionmachine.division_machine_id])
    if already_played_count > 0:
        raise i_am_a_teapot('Can not play the same game twice in one ticket',"^")
    divisionmachine.player_id = player.player_id
    DB.session.commit()
    return jsonify(divisionmachine.to_dict_simple())

@App.route('/divisionmachine/<divisionmachine_id>/player/<player_id>/clear', methods=['PUT'])
@login_required
@fetch_entity(DivisionMachine, 'divisionmachine')
@fetch_entity(Player, 'player')
def clear_machine_player(divisionmachine, player):
    """clear a machine - its not mine - ARRRRR"""
    if player.division_machine is None:
        raise Conflict('Player %s is not playing machine %s !' % (player.player_id,divisionmachine.machine.name))                
    if player.division_machine.division_machine_id != divisionmachine.division_machine_id:
        raise Conflict('Player %s is not playing machine %s (but in a really weird way)!' % (player.player_id,divisionmachine.machine.name))
    divisionmachine.player_id = None
    # player.division_machine = None
    # division_id = machine.division[0].division_id
    # entry = Entry.query.filter_by(player_id=player.player_id,completed=False,active=True,voided=False,division_id=division_id).first()
    # if entry is None:
    #     raise Conflict('What the shit?!')
    # app.routes.entry.add_score(entry,machine,'-1')    
    # if len(entry.scores) >= tom_config.scores_per_entry:
    #     app.routes.entry.complete_entry(entry)
    # if player.player_is_an_asshole_count is None:
    #     player.player_is_an_asshole_count=0        
    # player.player_is_an_asshole_count=player.player_is_an_asshole_count+1
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
    """get a division machine"""
    return jsonify(divisionmachine.to_dict_simple())
