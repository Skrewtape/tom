import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Machine, Player, Entry, Score
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity
from werkzeug.exceptions import Conflict

@App.route('/machine', methods=['GET'])
def get_machines():
    """Get a list of players"""
    return jsonify({m.machine_id: m.to_dict_simple() for m in
                    Machine.query.all()
    })

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
