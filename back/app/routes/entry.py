"""Routes for dealing with entries"""
import json

from flask import jsonify, request

from flask_login import login_required
from flask_restless.helpers import to_dict

from app import App, Scorekeeper_permission, DB

from app.types import Entry, Player, Division, Machine, Tournament

from app.routes.util import fetch_entity

from werkzeug.exceptions import NotFound, Conflict

def entry_dict(entry):
    entry_dict = to_dict(entry)
    entry_dict['player'] = to_dict(entry.player)
    entry_dict['machine'] = to_dict(entry.machine)
    entry_dict['division'] = to_dict(entry.division)
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

@App.route('/tournament/<tournament_id>/entry/free', methods=['GET'])
@login_required
@fetch_entity(Tournament, 'tournament')
def get_free_entries(tournament):
    """Get free entries"""
    return jsonify(entries = [entry_dict(e) for e in Entry.query.filter(
        Entry.machine == None
    ).filter(
        Entry.division.has(Division.tournament == tournament)
    ).join(Player, Entry.player).join(Division, Entry.division).order_by(
        Player.last_name.asc(),
        Player.first_name.asc(),
        Division.name.asc()
    ).all()])

@App.route('/tournament/<tournament_id>/entry/scoring', methods=['GET'])
@login_required
@fetch_entity(Tournament, 'tournament')
def get_scoring_entries(tournament):
    """Get entries ready for scoring"""
    return jsonify(entries = [entry_dict(e) for e in Entry.query.filter(
        Entry.machine != None
    ).filter(
        (Entry.score == 0) | (Entry.score == None)
    ).filter(
        Entry.division.has(Division.tournament == tournament)
    ).join(
        Player, Entry.player
    ).join(
        Division, Entry.division
    ).join(
        Machine, Entry.machine
    ).all()])

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
