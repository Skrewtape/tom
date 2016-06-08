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

@App.route('/team/player/<player_id>', methods=['GET'])
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

@App.route('/team/<team_id>', methods=['GET'])
@fetch_entity(Team, 'team')
def get_team(team):
    return jsonify(team.to_dict_with_players())

@App.route('/team/<team_id>/division/<division_id>/entry/active', methods=['GET'])
@fetch_entity(Team, 'team')
@fetch_entity(Division, 'division')
def get_active_team_entry(team,division):
    #FIXME : this should be able to handle returning all division, not just a specified one
    """
description: Get a list of active(i.e. not completed, not voided) entries for a team in a given division
post data: 
    none
url params:     
    team_id: int : id of team to get entries for
    division_id : int : id of division to look for active entries in
returns:
    dict of active entry for team.
    key for dict is "entry", value is a dict of entry   
    """     
 
    team = Team.query.filter_by(team_id=team.team_id).first()
    team_entries = Entry.query.filter_by(team_id=team.team_id,division_id=division.division_id,completed=False,voided=False,active=True).all()
    #FIXME : should only get active divisions
    #divisions = Division.query.all()
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
@Admin_permission.require(403)
@login_required
def add_team():    
    """
description: Add new team
post data: 
    players: list : list of player ids to create team with
    team_name: string : (optional) name of new team 
url params: 
    none
returns:
    dict of new team
notes:
    if no team name is specified, a team name will be created using the player first names
    """

    team_data = json.loads(request.data)    
    num_posted_players = len(team_data['players'])
    num_actual_players = Player.query.filter(Player.player_id.in_(team_data['players'])).count()
    if num_actual_players != num_posted_players:
        raise BadRequest('One of the players submitted was not valid')
    actual_players = Player.query.filter(Player.player_id.in_(team_data['players'])).all()
    for player in actual_players:
        if shared_get_player_teams(player.player_id):
            raise Conflict('One of the players specified is already on another team')
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
