import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Player, Division, Entry, Score, Tournament, Team, DivisionMachine, Token, Metadivision
from app import App, Admin_permission, Desk_permission, DB
from app.routes.util import fetch_entity, calculate_score_points_from_rank
from werkzeug.exceptions import Conflict
from flask import render_template
from flask.ext.cors import cross_origin
from flask_restless.helpers import to_dict
from operator import itemgetter
import random
import numpy

entry_id_idx=0
player_id_idx=1
team_id_idx=1
entry_score_sum_idx=2
entry_rank_idx=3
voided_idx=4
completed_idx=5

machine_name_idx=0
score_idx=1
score_entry_id_idx=2
score_rank_idx=3
papa_points_idx=4

def get_index_sidebar_info():
    tournaments = Tournament.query.all()    
    divisions = Division.query.all()
    division_machines = DivisionMachine.query.all()
    teams = Team.query.all()
    division_machine_results = {}
    division_results = {}
    tournament_results = {}
    division_scoring_type = {}
    return_team_results = {}
    for tournament in tournaments:
        tournament_results[tournament.tournament_id]=to_dict(tournament)

    for division in divisions:
        division_dict = to_dict(division)
        tournament = tournament_results[division.tournament_id]
        if tournament['single_division'] is True:
            division_dict['name']=tournament['name']
        else:
            division_dict['name']="%s %s" % (tournament['name'], division.name)            
        division_results[division.division_id]=division_dict
        division_machine_results[division.division_id] = []
        division_scoring_type[division.division_id]=tournament['scoring_type']
        
    for division_machine in division_machines:
        division_machine_results[division_machine.division_id].append(division_machine.to_dict_simple())

    for team in teams:
        return_team_results[team.team_id]=team.to_dict_with_players()
        
    return {'teams':return_team_results,'divisions':division_results,'division_machines':division_machine_results,'tournaments':tournament_results,'divisions_scoring_type':division_scoring_type}

def get_scores_ranked_by_machine(division_id):
    """
    Return all machines scores for a given division with ranks and points for each machine
    """
    return DB.engine.execute("select machine.name, score.score, score.entry_id, rank() over (partition by score.division_machine_id order by score.score desc) as machine_rank, testing_papa_scoring(rank() over (partition by score.division_machine_id order by score.score desc)) as machine_papa_score from score,entry,division_machine,machine where score.division_machine_id = division_machine.division_machine_id and division_machine.machine_id = machine.machine_id and score.entry_id = entry.entry_id and entry.division_id = %s and entry.completed = true and entry.voided = false order by machine_papa_score desc" % division_id)

def get_scores_for_machine(division_machine_id):
    """
    The same as get_scores_ranked_by_machine, except you only get scores for a specific division_machine_id
    """    
    return DB.engine.execute("select machine.name, score.score, score.entry_id, rank() over (partition by score.division_machine_id order by score.score desc) as machine_rank, testing_papa_scoring(rank() over (partition by score.division_machine_id order by score.score desc)) as machine_papa_score, entry.player_id from score,entry,division_machine,machine where score.division_machine_id = division_machine.division_machine_id and division_machine.machine_id = machine.machine_id and score.entry_id = entry.entry_id and score.division_machine_id = %s and entry.completed = true and entry.voided = false order by machine_papa_score desc" % division_machine_id)

def get_herb_scores_for_machine(division_machine_id):

    inner_join_query = "select division_machine_id,player_id, max(score.score) as max_score from score,entry where score.entry_id=entry.entry_id and score.division_machine_id = %d and entry.voided=false group by division_machine_id,player_id" % int(division_machine_id)
    
    get_highest_score_for_each_player_subquery = "select e.player_id, a.score, a.score_id,a.division_machine_id,a.entry_id from score as a inner join (%s) as b on a.division_machine_id = b.division_machine_id and a.score = b.max_score join entry as e on a.entry_id=e.entry_id join division_machine as d on a.division_machine_id=d.division_machine_id where a.division_machine_id=%d" % (inner_join_query,int(division_machine_id))

    return DB.engine.execute("select 'machine_name', ss.score, ss.entry_id, rank() over (partition by ss.division_machine_id order by ss.score desc) as rank, testing_papa_scoring(rank() over (partition by ss.division_machine_id order by ss.score desc)) as entry_score, ss.player_id from (%s) as ss order by entry_score desc" % (get_highest_score_for_each_player_subquery));

def get_herb_ranked_division_entries(division_id):
    """
    Get all ranks and points for players in a given herb division using player's top 3 entries. 
    Note that this returns a dict, not raw query results.
    """
    inner_join_query = "select division_machine_id,player_id, max(score.score) as max_score from score,entry where entry.division_id = %d and score.entry_id=entry.entry_id and entry.voided = false group by division_machine_id,player_id" % int(division_id)

    get_highest_score_for_each_player_subquery = "select e.division_id, e.player_id, a.score, a.score_id,a.division_machine_id,e.entry_id,m.name as machine_name from score as a inner join (%s) as b on a.division_machine_id = b.division_machine_id and a.score = b.max_score join entry as e on a.entry_id=e.entry_id join division_machine as d on a.division_machine_id=d.division_machine_id join machine as m on d.machine_id=m.machine_id" % inner_join_query
    
    herb_results = DB.engine.execute("select tt.machine_name, tt.division_machine_id, tt.player_id, testing_papa_scoring(rank() over (partition by tt.division_machine_id order by score desc)) as papascore, rank() over (partition by tt.division_machine_id order by score desc) as paparank from (%s) as tt order by player_id, papascore desc" % get_highest_score_for_each_player_subquery);    
    
    herb_player_results = {}
    sorted_herb_player_results = []
    
    for result in herb_results:
        player_id = result['player_id']
        if player_id not in herb_player_results:
            herb_player_results[player_id]=[]
        if len(herb_player_results[player_id])<3:            
            herb_player_results[player_id].append(result)
    for (herb_player_id,herb_player_scores) in herb_player_results.iteritems():
        total_score = sum(score['papascore'] for score in herb_player_scores)
        sorted_herb_player_results.append({'player_id':herb_player_id,'rank':0,'score':total_score,'scores':herb_player_scores})
    sorted_herb_player_results = sorted(sorted_herb_player_results, key=itemgetter('score'), reverse=True)
    rank = 0
    actual_rank = 0
    score = 0
    for result in sorted_herb_player_results:
        actual_rank = actual_rank + 1
        old_score = score
        score = result['score']
        if old_score != score:
            rank = actual_rank            
        result['rank'] = rank
    return sorted_herb_player_results

def get_ranked_division_entries(division_id, isplayer=False, isteam=False):
    if isplayer:
        entry_player_id="player_id"
    if isteam:
        entry_player_id="team_id"

    papa_score_for_each_score_in_division = "select %s, score.entry_id, testing_papa_scoring(rank() over (partition by division_machine_id order by score.score desc)) as machine_papa_score from score,entry where score.entry_id = entry.entry_id and division_id = %s and completed = true and voided = false" % (entry_player_id, division_id)
    papa_score_for_each_entry_in_division = "select entry_id, %s, sum(machine_papa_score) as entry_score_sum  from (%s) as ss group by ss.entry_id, %s order by entry_score_sum desc limit 200" % (entry_player_id,papa_score_for_each_score_in_division,entry_player_id)
    return DB.engine.execute("select entry_id, %s, entry_score_sum, rank() over (order by entry_score_sum desc) as entry_rank from (%s) as tt" %  (entry_player_id,papa_score_for_each_entry_in_division))    

def get_player_entries_ranked_by_division(division_id,isplayer=False,isteam=False):
    """
    The same as get_ranked_division_entries, except you include uncompleted entries
    """
    if isplayer:
        entry_player_id="player_id"
    if isteam:
        entry_player_id="team_id"

    papa_score_for_each_score_in_division = "select entry.completed, %s, score.entry_id, testing_papa_scoring(rank() over (partition by division_machine_id order by score.score desc)) as machine_papa_score from score,entry where score.entry_id = entry.entry_id and division_id = %s and entry.voided = false" % (entry_player_id,division_id)
    papa_score_for_each_entry_in_division = "select completed, entry_id, %s, sum(machine_papa_score) as entry_score_sum  from (%s) as ss group by ss.entry_id, %s,completed order by entry_score_sum desc" % (entry_player_id,papa_score_for_each_score_in_division,entry_player_id)    
    return DB.engine.execute("select entry_id, %s, entry_score_sum, rank() over (order by entry_score_sum desc) as entry_rank, completed from (%s) as tt" % (entry_player_id,papa_score_for_each_entry_in_division) )        


def get_entries_from_entry_results(division_id,player_id=None,team_id=None):    
    if player_id:
        entry_results = get_player_entries_ranked_by_division(division_id,isplayer=True)
    else:
        entry_results = get_player_entries_ranked_by_division(division_id,isteam=True)
    
    return_score_results = get_scores_from_score_results(division_id)
    
    return_entry_results = []
    return_inprogress_entry_results = []
    
    for result in entry_results:
        if 'team_id' in result:
            entry_team_id = result['team_id']        
        else:
            entry_player_id = result['player_id']
        entry_id = result['entry_id']
        new_result = {}
        
        for k in result.keys():
            new_result[k]=result[k]
        new_result['scores']=return_score_results[entry_id]  
        if player_id and entry_player_id != int(player_id):
            continue
        if team_id and entry_team_id != int(team_id):
            continue
        if new_result['completed'] is False:
            return_inprogress_entry_results.append(new_result)            
            continue        
        return_entry_results.append(new_result)
    return return_entry_results,return_inprogress_entry_results


def get_scores_from_score_results(division_id):
    return_score_results = {}
    score_results = get_scores_ranked_by_machine(division_id)
    for score in score_results:
        score_entry_id = score['entry_id']
        if not score_entry_id in return_score_results:
            return_score_results[score_entry_id] = []
        return_score_results[score_entry_id].append(score)
    return return_score_results

@App.route('/results/player/<player_id>', methods=['GET'])
def results_player(player_id):
    divisions = Division.query.all()
    return_entry_results = {}
    return_score_results = None
    return_inprogress_entry_results = {}
    player = Player.query.filter_by(player_id=player_id).first()
    if player.team:
        team_id = player.team[0].team_id
    else:
        team_id = None
    for division in divisions:
        division_id = division.division_id
        return_entry_results[division_id],return_inprogress_entry_results[division_id] = get_entries_from_entry_results(division_id,player_id=player_id)
        team_tournament = Tournament.query.filter_by(tournament_id=division.tournament_id).first().team_tournament
        if team_id and team_tournament:
            return_entry_results[division_id],return_inprogress_entry_results[division_id] = get_entries_from_entry_results(division_id,team_id=team_id)
            
    tokens = Token.query.filter_by(player_id=player_id).all()
    player = Player.query.filter_by(player_id=player_id).first()
    token_results = {}
    token_metadivision_results = {}
    player_results = player.to_dict_with_team()
    metadivisions_results = {}
    metadivisions = Metadivision.query.all()
    for metadiv in metadivisions:
        metadivisions_results[metadiv.metadivision_id]=metadiv.to_dict_simple()        

    for token in tokens:        
        #FIXME : need to handle teams
        if token.division_id is not None:
            if token.division_id not in token_results:
                token_results[token.division_id] = 0            
            token_results[token.division_id]=token_results[token.division_id]+1
        if token.metadivision_id is not None:            
            if token.metadivision_id not in token_metadivision_results:
                token_metadivision_results[token.metadivision_id] = 0            
            token_metadivision_results[token.metadivision_id]=token_metadivision_results[token.metadivision_id]+1
        
    return render_template('player_results.html', player_entries=return_entry_results,
                           player=player_results,division_tokens=token_results,
                           inprogress_entries=return_inprogress_entry_results,
                           metadivision_tokens=token_metadivision_results, metadivisions=metadivisions_results,
                           sidebar_info=get_index_sidebar_info())

@App.route('/results/team/<team_id>', methods=['GET'])
def results_team(team_id):
    divisions = Division.query.all()
    return_entry_results = {}
    return_score_results = None
    return_inprogress_entry_results = {}
    team = Team.query.filter_by(team_id=team_id).first()
    team_results = team.to_dict_with_players()
    
    for division in divisions:
        division_id = division.division_id
        return_entry_results[division_id],return_inprogress_entry_results[division_id] = get_entries_from_entry_results(division_id,team_id=team_id)

    return render_template('team_results.html', team_entries=return_entry_results,
                           team=team_results,
                           inprogress_entries=return_inprogress_entry_results,                           
                           sidebar_info=get_index_sidebar_info())


@App.route('/results/players', methods=['GET'])
def results_players():
    players = Player.query.all()
    player_results = []

    for player in players:
        player_results.append(player.to_dict_simple())

    return render_template('players_results.html', 
                           players=player_results, sidebar_info=get_index_sidebar_info())

@App.route('/results/teams', methods=['GET'])
def results_teams():
    teams = Team.query.all()
    team_results = []

    for team in teams:
        team_results.append(team.to_dict_with_players())

    return render_template('teams_results.html', 
                           teams=team_results, sidebar_info=get_index_sidebar_info())


@App.route('/results/index', methods=['GET'])
def results_index():
    return render_template('index.html', sidebar_info=get_index_sidebar_info())

@App.route('/results/division_machine/<division_machine_id>', methods=['GET'])
def results_division_machine(division_machine_id):
    tournament = Tournament.query.join(Division).join(Entry).join(DivisionMachine).filter_by(division_machine_id=division_machine_id).first()
    if tournament.scoring_type == "herb":
        score_results = get_herb_scores_for_machine(division_machine_id)        
    else:
        score_results = get_scores_for_machine(division_machine_id)    
    players = Player.query.all()
    player_results = {}
    return_score_results = []

    for player in players:
        player_results[player.player_id]=to_dict(player)

    return_division_machine=DivisionMachine.query.filter_by(division_machine_id=division_machine_id).first().to_dict_simple()    

    for score in score_results:        
        return_score_results.append({'rank':score[3],'score':score[1],'player_id':score[5],'points':score[4],'entry_id':score[2]})
        

    return render_template('machine_results.html', machine_scores=return_score_results,
                           players=player_results,
                           division_machine=return_division_machine,
                           sidebar_info=get_index_sidebar_info())
        



@App.route('/results/division/<division_id>', methods=['GET'])
def results_divisions(division_id=None):    
    tournament = Tournament.query.join(Division).filter_by(division_id=division_id).first()
    
    if tournament.scoring_type == "herb":
        entry_results = get_herb_ranked_division_entries(division_id)
    else:
        entry_results = get_ranked_division_entries(division_id,isplayer=not tournament.team_tournament,isteam=tournament.team_tournament)
        score_results= get_scores_ranked_by_machine(division_id)
        
    
    players = Player.query.all()
    player_results = {}
    return_entry_results = []
    return_score_results = {}
    return_team_results={}
    
    for player in players:
        player_results[player.player_id]=to_dict(player)
        
    if tournament.scoring_type == "papa":    
        return_score_results=get_scores_from_score_results(division_id)
        
    if tournament.scoring_type == "papa":            
        for result in entry_results:
            new_result = {}
            for k in result.keys():
                new_result[k]=result[k]
                new_result['scores'] = return_score_results[result['entry_id']]
            return_entry_results.append(new_result)
    else:
        return_entry_results = entry_results
        
    division = Division.query.filter_by(division_id=division_id).first().to_dict_simple()

    tournament_dict = Tournament.query.filter_by(tournament_id=division['tournament_id']).first().to_dict_simple()

    if tournament.scoring_type=="papa":
        template_name = 'division_results.html'
    else:
        template_name = 'division_herb_results.html'
    return render_template(template_name, division_entrys=return_entry_results,
                           players=player_results,division=division,
                           tournament=tournament_dict, teams=return_team_results,
                           sidebar_info=get_index_sidebar_info())



    
