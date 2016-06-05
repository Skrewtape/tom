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

def shared_get_player_teams(player_id):
    return Team.query.filter(Team.players.any(Player.player_id.__eq__(player_id))).all()    

@App.route('/team/player/<player_id>', methods=['get'])
def get_player_teams(player_id):
    """
description: Get teams for a given player
post data: 
    none
url params: 
    player_id: int : id of player to retrieve teams for
returns:
    dict of all teams for given player
    dict key is "teams".  Value is list of all teams player is a part of.
    """
    
    teams = shared_get_player_teams(player_id)
    return jsonify({'teams':[x.to_dict_simple() for x in teams]})

@App.route('/team/<team_id>', methods=['get'])
@fetch_entity(Team, 'team')
def get_team(team):
    return jsonify(team.to_dict_with_players())

@App.route('/team/<team_id>/division/<division_id>/entry/active', methods=['GET'])
@fetch_entity(Team, 'team')
@fetch_entity(Division, 'division')
def get_active_team_entry(team,division):
    """Get a list of open(i.e. not completed, not voided) entries for a team"""
    team = Team.query.filter_by(team_id=team.team_id).first()
    team_entries = Entry.query.filter_by(team_id=team.team_id,division_id=division.division_id,completed=False,voided=False,active=True).all()
    #FIXME : should only get active divisions
    divisions = Division.query.all()
    entries_grouped_dict = {}
    entry_id=None
    matched_entry=None
    for entry in team_entries:
        if entry.division_id == division.division_id:
            matched_entry = entry
    if matched_entry:
        return jsonify({'entry':matched_entry.to_dict_with_scores()})
    else:
        return jsonify({'entry':None})

@App.route('/team', methods=['POST'])
def add_team():
    #FIXME : need to make sure you can't be part of 2 teams
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
