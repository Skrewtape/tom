import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Entry, Score, Player, Division, Machine, Token, Team
from app import App, Admin_permission, Scorekeeper_permission, Void_permission, DB
from app.routes.util import fetch_entity, calculate_score_points_from_rank
from app import tom_config
from werkzeug.exceptions import Conflict, BadRequest

@App.route('/team/player/<player_id>', methods=['get'])
def get_player_teams(player_id):
    #FIXME : this should be a shared function
    teams = Team.query.filter(Team.players.any(Player.player_id.__eq__(player_id)))
    return jsonify({'teams':[x.to_dict_simple() for x in teams]})

@App.route('/team', methods=['POST'])
def add_team():
    team_data = json.loads(request.data)    
    num_posted_players = len(team_data['players'])
    num_actual_players = Player.query.filter(Player.player_id.in_(team_data['players'])).count()
    if num_actual_players != num_posted_players:
        raise BadRequest('One of the players submitted was not valid')
    actual_players = Player.query.filter(Player.player_id.in_(team_data['players'])).all()
    if team_data.has_key('team_name') == False:
        team_data['team_name'] = " and ".join(["%s %s" % (x.first_name,x.last_name) for x in actual_players])
    new_team = Team(
        team_name=team_data['team_name']
    )        
    for player in actual_players:
        new_team.players.append(player)
    DB.session.add(new_team)
    DB.session.commit()
    
    return jsonify(new_team.to_dict_simple())    
