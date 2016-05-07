import json
import app
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Machine, Player, Entry, Score, Division
from app.routes import entry
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity
from werkzeug.exceptions import Conflict
from app import tom_config

@App.route('/machine', methods=['GET'])
def get_machines():
    """Get a list of all machines"""
    return jsonify({m.machine_id: m.to_dict_simple() for m in
                    Machine.query.all()
    })

@App.route('/machine/active', methods=['GET'])
def get_active_machines():
    """Get a list of all active machines"""
    divisions = Division.query.all()
    active_machines = {}
    for division in divisions:
        for machine in division.machines:
            active_machines[machine.machine_id]=machine.to_dict_simple()
    return jsonify(active_machines)
    


@App.route('/machine/<machine_id>/player/<player_id>', methods=['PUT'])
@login_required
@fetch_entity(Machine, 'machine')
@fetch_entity(Player, 'player')
def set_machine_player(machine, player):
    """claim a machine - its mine - ARRRRR"""
    #FIXME : need check that player has active entry in the division the machine is in
    if player.machine:
        raise Conflict('Player already is playing the machine %s !' % player.machine.name)        
    player_entries = Entry.query.filter_by(player_id=player.player_id,completed=False,voided=False).all()        
    if player_entries is None:
        raise Conflict('Player does not have any entries')
    player.machine = machine
    DB.session.commit()
    return jsonify(machine.to_dict_with_player())

@App.route('/machine/<machine_id>/player/<player_id>/clear', methods=['PUT'])
@login_required
@fetch_entity(Machine, 'machine')
@fetch_entity(Player, 'player')
def clear_machine_player(machine, player):
    """claim a machine - its mine - ARRRRR"""
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



@App.route('/machine/<machine_id>', methods=['GET'])
@fetch_entity(Machine, 'machine')
def get_machine(machine):
    """get a machine"""
    return jsonify(machine.to_dict_with_player())

@App.route('/machine/<machine_id>/rankings', methods=['GET'])
@fetch_entity(Machine, 'machine')
def get_machine_rankings(machine):
    machine_scores = Score.query.filter_by(machine_id=machine.machine_id).join(Entry,Score.entry).filter_by(voided=False,completed=True).order_by(Score.rank.asc()).limit(200)
    machine_scores_list = []
    for machine_score in machine_scores:
        machine_scores_list.append(machine_score.to_dict_simple())
    return jsonify({'rankings':machine_scores_list})
