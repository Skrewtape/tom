"""Routes for dealing with players"""
import json

from flask import jsonify, request

from flask_login import login_required
from flask_restless.helpers import to_dict

from app import App, Admin_permission, DB

from app.types import Player

from app.routes.util import fetch_entity

@App.route('/player', methods=['POST'])
@login_required
@Admin_permission.require(403)
def add_player():
    """Add a player"""
    player_data = json.loads(request.data)
    new_player = Player(
        first_name = player_data['first_name'],
        last_name = player_data['last_name']
    )
    DB.session.add(new_player)
    DB.session.commit()
    return jsonify(to_dict(new_player))

@App.route('/player/<player_id>', methods=['GET'])
@login_required
@fetch_entity(Player, 'player')
def get_player(player):
    """Get a player"""
    player_data = to_dict(player)
    return jsonify(player_data)

@App.route('/player', methods=['GET'])
@login_required
def get_players():
    """Get a list of players"""
    return jsonify(players=[
        to_dict(p) for p in
        Player.query.order_by(Player.last_name.asc(), Player.first_name.asc()).all()
    ])
