import json
import app
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Machine, Player, Entry, Score, Division, DivisionMachine
from app.routes import entry
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity
from werkzeug.exceptions import Conflict
from app import tom_config

@App.route('/machine/active', methods=['GET'])
def get_active_machines():
    """Get a list of all active division machines"""
    divisions = Division.query.all()
    active_machines = {}
    for division in divisions:
        for machine in division.machines:
            active_machines[machine.machine_id]=machine.to_dict_simple()
    return jsonify(active_machines)

@App.route('/machine/<divisionmachine_id>/player/<player_id>', methods=['PUT'])
@login_required
@fetch_entity(DivisionMachine, 'divisionmachine')
@fetch_entity(Player, 'player')
def set_machine_player(divisionmachine, player):
    """claim a machine - its mine - ARRRRR"""
    if player.division_machine:
        raise Conflict('Player already is playing the machine %s !' % player.machine.name)        
    #FIXME : need to handle team entries
    #FIXME : need to start an entry if you have tokens
    player_entries = Entry.query.filter_by(division_id=divisionmachine.division_id,player_id=player.player_id,completed=False,voided=False,active=True).all()        
    if player_entries is None:
        raise Conflict('Player does not have any entries')
    divisionmachine.player_id = player.player_id
    #FIXME : need to handle creating new entry if needed
    #player.machine = machine
    DB.session.commit()
    return jsonify(machine.to_dict_with_player())

@App.route('/machine/<machine_id>/player/<player_id>/clear', methods=['PUT'])
@login_required
@fetch_entity(Machine, 'machine')
@fetch_entity(Player, 'player')
def clear_machine_player(machine, player):
    """clear a machine - its not mine - ARRRRR"""
    #FIXME : need check that player has active entry in the division the machine is in
    if player.machine.machine_id != machine.machine_id:
        raise Conflict('Player %s is not playing machine %s !' % (player.player_id,player.machine.name))        
    player.machine = None
    division_id = machine.division[0].division_id
    entry = Entry.query.filter_by(player_id=player.player_id,completed=False,active=True,voided=False,division_id=division_id).first()
    if entry is None:
        raise Conflict('What the shit?!')
    app.routes.entry.add_score(entry,machine,'-1')    
    if len(entry.scores) >= tom_config.scores_per_entry:
        app.routes.entry.complete_entry(entry)
    if player.player_is_an_asshole_count is None:
        player.player_is_an_asshole_count=0        
    player.player_is_an_asshole_count=player.player_is_an_asshole_count+1
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
    return jsonify(divisionmachine.to_dict_with_player())
