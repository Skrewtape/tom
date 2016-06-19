import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Player, Division, Entry, Score, Tournament, Team, Finals, Machine, DivisionMachine, FinalsMatch,  FinalsPlayer, FinalsScore
from app import App, Admin_permission, Desk_permission, Scorekeeper_permission, DB
from app.routes.util import fetch_entity, calculate_score_points_from_rank
from werkzeug.exceptions import Conflict
from flask_restless.helpers import to_dict
from sqlalchemy.sql import func
from operator import itemgetter

@App.route('/finals/match/match_id/<match_id>', methods=['GET'])
@fetch_entity(FinalsMatch, 'match')
def get_match(match):
    finals_match = FinalsMatch.query.filter_by(match_id=match.match_id).first()    
    return jsonify(finals_match.to_dict_simple())

@App.route('/finals/<finals_id>/match', methods=['GET'])
@fetch_entity(Finals, 'finals')
def get_matches_for_final(finals):
    return shared_get_matches_for_final(finals)

def get_finals_match_results(match_id):
    query_string = "select finals_player_id, sum(rank) from (select finals_player_id, finals_papa_scoring(rank() over (partition by game_number order by score desc)) as rank from finals_score where match_id = %d  order by game_number) as tt group by finals_player_id order by sum(rank) desc"
    return DB.engine.execute(query_string % (match_id))

def shared_get_matches_for_final(finals):
    matches_dict = {}
    sorted_total_points = {}
    losers={}
    sorted_losers={}    
    games={}

    starting_loser_rank_in_round={1:17,2:9,3:5,4:1}
    for round in range(finals.rounds):
        round=round+1
        matches_dict[round]={}
        losers[round]={}
        sorted_losers[round]=[]        
    finals_matches = FinalsMatch.query.filter_by(finals_id=finals.finals_id)    

    query_string = "select finals_player_id, sum(rank) from (select finals_player_id, finals_papa_scoring(rank() over (partition by game_number order by score desc)) as rank from finals_score where match_id = %d  order by game_number) as tt group by finals_player_id order by sum(rank) desc"
    for match in finals_matches:        
        game_1_results = DB.engine.execute(query_string % (match.match_id))
        num_scores_in_match = FinalsScore.query.filter_by(match_id=match.match_id).filter(FinalsScore.score != None).count()        
        match_dict = match.to_dict_simple()
        total_games_finished=num_scores_in_match/4
        match_dict['games']={0:[],1:[],2:[]}
        for player in match.finals_players:
            for score in player.finals_scores:
                match_dict['games'][score.game_number].append(score.to_dict_simple())      
        if num_scores_in_match==12:            
            winner_one = game_1_results.fetchone()
            winner_two = game_1_results.fetchone()
            loser_one = game_1_results.fetchone()
            loser_two = game_1_results.fetchone()
            if match.round_id == finals.rounds:
                match_dict['finals_players'][winner_one[0]]['status']="1st"
                match_dict['finals_players'][winner_two[0]]['status']="2nd"
                match_dict['finals_players'][loser_one[0]]['status']="3rd"
                match_dict['finals_players'][loser_two[0]]['status']="4th"            
                
            else:
                match_dict['finals_players'][winner_one[0]]['status']="Proceed"
                match_dict['finals_players'][winner_two[0]]['status']="Proceed"            
            for loser in [loser_one,loser_two]:
                if losers[match.round_id].has_key(loser[0]):
                    losers[match.round_id][loser[0]]['player_score']=losers[match.round_id][loser[0]]['player_score']+loser[1]
                else:
                    losers[match.round_id][loser[0]]={'player_id':loser[0],'player_score':loser[1],'match_id':match.match_id}            
        else:
            status="%d Games Completed" % total_games_finished
            for (player_id,player) in match_dict['finals_players'].iteritems():
                player['status']=status                
        matches_dict[match.round_id][match.match_id]=match_dict
    for round in range(finals.rounds):                
        round = round + 1
        round_of_losers = []
        for (player_id,loser) in losers[round].iteritems():
            round_of_losers.append(loser)        
        sorted_losers[round] = sorted(round_of_losers, key=itemgetter('player_score'), reverse=True)        
        
    for round in range(finals.rounds):                
        round = round + 1        
        for rank in range(len(sorted_losers[round])):
            loser = sorted_losers[round][rank]            
            match_id = loser['match_id']
            if round != finals.rounds:
                matches_dict[round][match_id]['finals_players'][loser['player_id']]['status']="LOSER (finished %d)" % (starting_loser_rank_in_round[round]+rank)
    return jsonify(matches_dict)
    
@App.route('/finals', methods=['GET'])
def get_all_active_finals():
    finals = Finals.query.filter_by(active=True).all()
    finals_dict = {'sorted_by_division_id':{},'sorted_by_finals_id':{}}
    for final in finals:
        finals_dict['sorted_by_division_id'][final.division_id]=final.to_dict_simple()
    return jsonify(finals_dict)

@Scorekeeper_permission.require(403)
@login_required
@App.route('/finals/machineId/<machine_id>/score/<finalsmatch_id>/game_num/<game_number>', methods=['POST'])
@fetch_entity(Machine, 'machine')
@fetch_entity(FinalsMatch, 'finalsmatch')
def set_match_machine(machine, finalsmatch, game_number):
    finals_scores = FinalsScore.query.filter_by(match_id=finalsmatch.match_id,game_number=game_number).all()
    for finals_score in finals_scores:
        new_division_machine = DivisionMachine(
            machine_id=machine.machine_id,
            finals_id=finalsmatch.finals_id
        )
        DB.session.add(new_division_machine)
        DB.session.commit()        
        finals_score.division_machine_id = new_division_machine.division_machine_id
        DB.session.commit()
    return jsonify({})

@App.route('/finals/test')
def test():
    finals_matches = FinalsMatch.query.filter_by(finals_id=1,round_id=1).all()
    for match in finals_matches:        
        match_results = get_finals_match_results(finals_match.match_id)
        winner_one = match_results.fetchone()
        winner_two = match_results.fetchone()
        print "match id is %s and winner_one id is %s " % (match.match_id,winner_one[0])        
    return jsonify({})

def get_players_ranked_by_qualifying(division_id,num_players):
    entry_results = DB.engine.execute("select entry_id, player_id, entry_score_sum, rank() over (order by entry_score_sum desc) from (select entry_id, player_id, sum(entry_score) as entry_score_sum  from (select entry.player_id, score.entry_id, testing_papa_scoring(rank() over (partition by division_machine_id order by score.score desc)) as entry_score from score,entry where score.entry_id = entry.entry_id and division_id = %s and completed = true and voided = false) as ss group by ss.entry_id, player_id order by entry_score_sum desc limit %d) as tt" % (division_id,num_players) )    
    ranked_players = []
    for player_result in entry_results:
        ranked_players.append(player_result)
    return ranked_players

def generate_ranking_list(playerlist=None,num_players_per_group=4):
    if playerlist is not None and len(playerlist) == 0:
        return []
    if playerlist is not None and len(playerlist) == 2 and num_players_per_group==2:
        return [playerlist]
    if playerlist is not None and len(playerlist) == 4 and num_players_per_group==4:
        return [playerlist]    
    player_group = []
    if num_players_per_group == 4:
        player_group.append(playerlist.pop(len(playerlist)/2))
        player_group.append(playerlist.pop(len(playerlist)/2))        
    player_group.append(playerlist.pop(0))
    player_group.append(playerlist.pop())   
    return [player_group]+generate_ranking_list(playerlist, num_players_per_group)
        

def get_finals_player_seed(finals_player_id):
    return FinalsPlayer.query.filter_by(finals_player_id=finals_player_id).first()

@Scorekeeper_permission.require(403)
@login_required
@App.route('/finals/finals_score/<finalsscore_id>/score/<score>', methods=['POST'])
@fetch_entity(FinalsScore, 'finalsscore')
def set_match_score(finalsscore, score):
    finals_score = FinalsScore.query.filter_by(finals_player_score_id=finalsscore.finals_player_score_id).first()
    finals_score.score = score
    DB.session.commit()
    finals_match = FinalsMatch.query.filter_by(match_id=finals_score.match_id).first()
    finals_scores = FinalsScore.query.join(FinalsMatch).filter_by(finals_id=finals_match.finals_id,round_id=finals_match.round_id).all()
    all_scores_for_match_entered=True
    for all_finals_score in finals_scores:
        if all_finals_score.score is None:
            all_scores_for_match_entered=False
    
    finals_matches = FinalsMatch.query.filter_by(finals_id=finals_match.finals_id,round_id=finals_match.round_id).all()
    next_round_matches = FinalsMatch.query.filter_by(finals_id=finals_match.finals_id,round_id=finals_match.round_id+1).all()    

    if all_scores_for_match_entered is False:
        return jsonify({})
    if finals_match.round_id==4:
        return jsonify({})
    advancing_players=[]
    for match in finals_matches:        
        match_results = get_finals_match_results(match.match_id)
        winner_one_player_id = match_results.fetchone()[0]
        winner_one = FinalsPlayer.query.filter_by(finals_player_id=winner_one_player_id).first()
        winner_two_player_id = match_results.fetchone()[0]
        winner_two = FinalsPlayer.query.filter_by(finals_player_id=winner_two_player_id).first()        
        advancing_players.append({'player_id':winner_one.player_id,'finals_seed':winner_one.finals_seed})
        advancing_players.append({'player_id':winner_two.player_id,'finals_seed':winner_two.finals_seed})
        
    for match in next_round_matches:        
        for finals_player in match.finals_players:
            if finals_player.player_id is not None:                
                advancing_players.append({'player_id':finals_player.player_id,'finals_seed':finals_player.finals_seed})
    sorted_advancing_players = sorted(advancing_players,key=lambda x:x['finals_seed'])
    advancing_players_groups=generate_ranking_list(sorted_advancing_players,4)        
    
    for player_group in advancing_players_groups:
        for player in player_group:
            print player['finals_seed']
        print "---"
    for match in next_round_matches:
        bobo_player_group = advancing_players_groups.pop()
        for finals_player in match.finals_players:
            bobo_player = bobo_player_group.pop()
            print "setting %d %d" %(bobo_player['player_id'],bobo_player['finals_seed'])
            finals_player.player_id = bobo_player['player_id']
            finals_player.finals_seed = bobo_player['finals_seed']
            DB.session.commit()
    return jsonify({})


@Scorekeeper_permission.require(403)
@login_required
@App.route('/finals/division/<division_id>', methods=['POST'])
@fetch_entity(Division, 'division')
def create_finals(division):
    new_finals = Finals(
        division_id=division.division_id,
        active=True,
        rounds=0
        )
    DB.session.add(new_finals)
    DB.session.commit()
    return jsonify(to_dict(new_finals))

@Scorekeeper_permission.require(403)
@login_required
@App.route('/finals/<finals_id>/division_machine/<machine_id>', methods=['POST'])
@fetch_entity(Finals, 'finals')
@fetch_entity(Machine, 'machine')
def create_finals_division_machine(finals,machine):
    new_division_machine = DivisionMachine(
        machine_id=machine.machine_id,
        finals_id=finals.finals_id
    )
    DB.session.add(new_division_machine)
    DB.session.commit()
    return jsonify(to_dict(new_division_machine))

@App.route('/finals/<finals_id>/division_machines', methods=['GET'])
@fetch_entity(Finals, 'finals')
def get_finals_division_machine(finals):
    finals_division_machines = {}
    for division_machine in finals.division_machines:
        finals_division_machines[division_machine.division_machine_id]=to_dict(division_machine)
        finals_division_machines[division_machine.division_machine_id]['name']=division_machine.machine.name        
    return jsonify(finals_division_machines)

def new_finals_player(num_per_group, match_id):
    for player_num in range(num_per_group):
        finals_player_root = FinalsPlayer(
            match_id = match_id
        )
        DB.session.add(finals_player_root)
    DB.session.commit()

def gen_finals_score(match_id):
    finals_players = FinalsPlayer.query.filter_by(match_id=match_id).all()
    for finals_player in finals_players:
        for game_number in range(3):
            new_finals_score = FinalsScore(
                match_id=match_id,
                finals_player_id=finals_player.finals_player_id,
                game_number=game_number
            )
            DB.session.add(new_finals_score)
    DB.session.commit()
    
def gen_finals_match(round_id,finals_id,match_with_byes=False):
    num_per_group=4
    new_finals_match = FinalsMatch(
        round_id=round_id,
        finals_id=finals_id,
        match_with_byes=False
    )
    if match_with_byes:
        new_finals_match.match_with_byes=True
    DB.session.add(new_finals_match)
    DB.session.commit()
    new_finals_player(num_per_group,new_finals_match.match_id)
    gen_finals_score(new_finals_match.match_id)
    return new_finals_match

@Scorekeeper_permission.require(403)
@login_required
@App.route('/finals/<finals_id>/generate_rounds', methods=['POST'])
@fetch_entity(Finals, 'finals')
def generate_finals_rounds(finals):
    last_bye_round = 2
    num_players = 24
    players_per_group = 4
    num_bye_rounds = 1
    num_per_group = 4
    num_rounds = ((num_players/num_per_group)/2) + num_bye_rounds
    finals.rounds = num_rounds
    DB.session.commit()
    num_byes_per_round = (num_players/3)
    cur_round_matches=[]
    next_round_matches=[]

    new_finals_match = gen_finals_match(num_rounds,finals.finals_id)
    cur_round_matches.append(new_finals_match)    
        
    for round in range(num_rounds,1,-1):
        child_round = round - 1
        for match in cur_round_matches:            
            if child_round >= last_bye_round:
                if child_round<=last_bye_round and child_round != 1:
                    set_bye=True
                else:
                    set_bye=False
                new_finals_match_left_child = gen_finals_match(child_round,finals.finals_id, set_bye)
                new_finals_match_right_child = gen_finals_match(child_round,finals.finals_id, set_bye)                    
                next_round_matches.append(new_finals_match_right_child)
                next_round_matches.append(new_finals_match_left_child)
            if child_round < last_bye_round:
                if child_round != 1:
                    set_bye=True
                else:
                    set_bye=False
                new_finals_match_child = gen_finals_match(child_round,finals.finals_id, set_bye)                    
                next_round_matches.append(new_finals_match_child)
        cur_round_matches = next_round_matches
        next_round_matches = []
    return jsonify({})

@Scorekeeper_permission.require(403)
@login_required
@App.route('/finals/<finals_id>/fill_rounds', methods=['POST'])
@fetch_entity(Finals, 'finals')
def fill_finals_rounds(finals):
    division_id = finals.division_id
    last_bye_round = 2
    num_players = 24
    players_per_group = 4
    num_bye_rounds = 1
    num_per_group = 4
    num_rounds = ((num_players/num_per_group)/2) + num_bye_rounds
    num_byes_per_round = (num_players/3)
    cur_round_matches=[]
    next_round_matches=[]
    
    bye_players = generate_ranking_list(get_players_ranked_by_qualifying(division_id,8)[:8],2)
    normal_players=generate_ranking_list(get_players_ranked_by_qualifying(division_id,24)[8:24],4)        
    matches_with_byes = FinalsMatch.query.filter_by(round_id=2,finals_id=finals.finals_id).all()        
    for match in matches_with_byes:
        bye_players_pair = bye_players.pop()
        for index, bye_player_info in enumerate(bye_players_pair):
            db_bye_player = match.finals_players[index]            
            db_bye_player.player_id = bye_player_info[1]
            db_bye_player.finals_seed = bye_player_info[3]                        
    matches_without_byes = FinalsMatch.query.filter_by(round_id=1,finals_id=finals.finals_id).all()        
    for match in matches_without_byes:
        normal_players_pair = normal_players.pop()
        for index, normal_player_info in enumerate(normal_players_pair):
            db_normal_player = match.finals_players[index]            
            db_normal_player.player_id = normal_player_info[1]
            db_normal_player.finals_seed = normal_player_info[3]                                
    DB.session.commit()
    return jsonify({})

