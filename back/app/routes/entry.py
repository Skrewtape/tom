"""Routes for dealing with entries"""
import json

from flask import jsonify, request

from flask_login import login_required
from flask_restless.helpers import to_dict

from app import App, Scorekeeper_permission, DB

from app.types import Entry, Player, Division, Machine

from app.routes.util import fetch_entity

from werkzeug.exceptions import NotFound, Conflict

def entry_dict(entry):
    entry_dict = to_dict(entry)
    entry_dict['player'] = to_dict(division.player)
    entry_dict['machine'] = to_dict(division.machine)
    entry_dict['division'] = to_dict(division.division)
    return entry_dict

@App.route('/player/<player_id>/entry', methods=['POST'])
@login_required
@Scorekeeper_permission.require(403)
@fetch_entity(Player, 'player')
def add_entry(player):
    """Create a new entry"""
    entry_data = json.loads(request.data)
    division = Division.query.get(entry_data['division_id'])
    if division is None:
        raise NotFound('division')
    if not division.tournament.active:
        raise Conflict('tournament closed')
    new_entry = Entry(
        division = division
    )
    player.entries.append(new_entry)
    DB.session.add(new_entry)
    DB.session.commit()
    return jsonify(entry_dict(new_entry))

@App.route('/entry/<entry_id>', methods=['GET'])
@login_required
@fetch_entity(Entry, 'entry')
def get_entry(division):
    """Get an entry"""
    return jsonify(entry_dict(entry))

@App.route('/entry/<entry_id>/machine/<machine_id>', methods=['PUT'])
@login_required
@Scorekeeper_permission.require(403)
@fetch_entity(Entry, 'entry')
@fetch_entity(Machine, 'machine')
def set_entry_machine(entry, machine):
    """Set the machine (spend) the entry"""
    if not entry.division.tournament.active:
        raise Conflict('tournament closed')
    if entry.machine is not None:
        raise Conflict('entry already spent')
    entry.machine = machine
    DB.session.commit()
    return jsonify(entry_dict(entry))
