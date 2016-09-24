import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Entry, Score, Player, Division, Machine, Token, Team, Metadivision, Tournament,CompToken, AuditLogEntry, Queue, DivisionMachine
from app import App, Admin_permission, Scorekeeper_permission, Void_permission, DB
from app.routes.util import fetch_entity, calculate_score_points_from_rank, get_division_from_metadivision
from app.routes import entry
from app import tom_config
from werkzeug.exceptions import Conflict, BadRequest
from flask_login import current_user
from flask_restless.helpers import to_dict
import time
from app.routes.v1 import v1_utils

@App.route('/queue/player_id/<player_id>', methods=['DELETE'])
@fetch_entity(Player, 'player')
def queue_remove_player(player):
    if player.queue:
        DB.session.delete(player.queue)
        DB.session.commit()
    return jsonify({})

@App.route('/queue/player_id/<player_id>', methods=['GET'])
@fetch_entity(Player, 'player')
def get_player_queue(player):
    if player.queue:
        return jsonify(player.queue.to_dict_simple())
    else:
        return jsonify({})
        
@App.route('/queue/player_id/<player_id>/division_machine_id/<divisionmachine_id>', methods=['POST'])
@fetch_entity(Player, 'player')
@fetch_entity(DivisionMachine, 'divisionmachine')
def add_player_to_queue(player,divisionmachine):
    existing_queue = Queue.query.filter_by(player_id=player.player_id).first()
    if existing_queue:
        DB.session.delete(existing_queue)
        DB.session.commit()
    new_queue = Queue(
        player_id=player.player_id,
        division_machine_id=divisionmachine.division_machine_id
    )
    DB.session.add(new_queue)
    DB.session.commit()
    return jsonify({})


@App.route('/queue/division/<division_id>', methods=['GET'])
@fetch_entity(Division, 'division')
def queue_get_all_queues_in_division(division):
    queues = Queue.query.join(DivisionMachine).filter_by(division_id=division.division_id).order_by(Queue.queue_id).all()
    machines = [m for m in division.machines]
    return_dict = {}
    for machine in machines:
        return_dict[machine.division_machine_id]=[]
    for queue in queues:
        return_dict[queue.division_machine_id].append(queue.to_dict_simple())        
    return jsonify(return_dict)
