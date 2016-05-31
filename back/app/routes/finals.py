import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Player, Division, Entry, Score, Tournament, Team, Finals, Machine, DivisionMachine, FinalsMatch,  FinalsPlayer, FinalsScore
from app import App, Admin_permission, Desk_permission, DB
from app.routes.util import fetch_entity, calculate_score_points_from_rank
from werkzeug.exceptions import Conflict
from flask_restless.helpers import to_dict

# workflow for finals
# 1) get list of finals
# 2) get list of rounds for a final
# 3) get list of matches for a round
# 4) get list of players in a match 
# 5) get list of scores for a match ( grouped by game ) 
# 6) select machine for a match
#

@App.route('/finals/match/match_id/<match_id>', methods=['GET'])
@fetch_entity(FinalsMatch, 'match')
def get_match(match):
    finals_match = FinalsMatch.query.filter_by(match_id=match.match_id).first()    
    return jsonify(finals_match.to_dict_simple())

@App.route('/finals/<finals_id>/match', methods=['GET'])
@fetch_entity(Finals, 'finals')
def get_matches_for_final(finals):
    matches_dict = {}
    sorted_total_points = {}
    
    for round in range(finals.rounds):
        round=round+1
        matches_dict[round]=[]
    finals_matches = FinalsMatch.query.filter_by(finals_id=finals.finals_id)
    total_points = {}
    for final_match in finals_matches:
        final_match_dict = final_match.to_dict_simple()
        for (player_id,player_points) in final_match_dict['player_ranks'].iteritems():
            if not total_points.has_key(player_id):
                total_points[player_id] = 0
            if player_points != 'Advancing':
                total_points[player_id] = total_points[player_id] + int(player_points)
        order_out=0
        matches_dict[final_match.round_id].append(final_match_dict)
    #for key, value in sorted(total_points.iteritems(), key=lambda (k,v): (v,k), reverse=True):
    #    sorted_total_points[key]=order_out
    #    order_out=order_out+1
    #final_match_dict['player_finished']=sorted_total_points        
    return jsonify(matches_dict)

@App.route('/finals', methods=['GET'])
def get_all_active_finals():
    finals = Finals.query.filter_by(active=True).all()
    finals_dict = {'finals':[]}
    for final in finals:
        finals_dict['finals'].append(final.to_dict_simple())
    return jsonify(finals_dict)

@App.route('/finals/divisionMachineId/<divisionmachine_id>/score/<finalsmatch_id>/game_num/<game_number>', methods=['POST'])
@fetch_entity(DivisionMachine, 'divisionmachine')
@fetch_entity(FinalsMatch, 'finalsmatch')
def set_match_machine(divisionmachine, finalsmatch, game_number):
    finals_scores = FinalsScore.query.filter_by(match_id=finalsmatch.match_id,game_number=game_number).all()
    for finals_score in finals_scores:
        finals_score.division_machine_id = divisionmachine.division_machine_id
    DB.session.commit()
    return jsonify({})

@App.route('/finals/finals_score/<finalsscore_id>/score/<score>', methods=['POST'])
@fetch_entity(FinalsScore, 'finalsscore')
def set_match_score(finalsscore, score):
    finals_score = FinalsScore.query.filter_by(finals_player_score_id=finalsscore.finals_player_score_id).first()
    finals_score.score = score
    DB.session.commit()
    finals_match = FinalsMatch.query.filter_by(match_id=finals_score.match_id).first()
    finals_matches = FinalsMatch.query.filter_by(finals_id=finals_match.finals_id,round_id=finals_match.round_id).all()
    next_round_matches = FinalsMatch.query.filter_by(finals_id=finals_match.finals_id,round_id=finals_match.round_id+1).all()    
    finals_scores = FinalsScore.query.join(FinalsMatch).filter_by(finals_id=finals_match.finals_id,round_id=finals_match.round_id).all()
    all_scores_for_match_entered=True
    for all_finals_score in finals_scores:
        if all_finals_score.score is None:
            all_scores_for_match_entered=False
    #FIXME : should not be hardcoding 4 here
    advancing_players={}
    sorted_advancing_players=[]
    if all_scores_for_match_entered:
    #if 1:
        # assign next round
        if finals_match.round_id==4:
            return
        for match in finals_matches:
            finals_match_dict = match.to_dict_simple()
            for (player_id,rank) in finals_match_dict['player_ranks'].iteritems():
                if rank=="Advancing":
                    advancing_players[FinalsPlayer.query.filter_by(finals_player_id=player_id).first().player_id]=FinalsPlayer.query.filter_by(finals_player_id=player_id).first().finals_seed
        for match in next_round_matches:
            players = match.finals_players
            for player in players:
                if player.player_id:
                    advancing_players[player.player_id]=player.finals_seed
        for key, value in sorted(advancing_players.iteritems(), key=lambda (k,v): (v,k), reverse=True):
           sorted_advancing_players.insert(0,key)
        print sorted_advancing_players
        ranked_players_pairs = [
            [sorted_advancing_players[0],
             sorted_advancing_players[7],
             sorted_advancing_players[8],
             sorted_advancing_players[15]
            ],
            [sorted_advancing_players[1],
             sorted_advancing_players[6],
             sorted_advancing_players[9],
             sorted_advancing_players[14]
            ],
            [sorted_advancing_players[2],
             sorted_advancing_players[5],
             sorted_advancing_players[10],
             sorted_advancing_players[13]
            ],
            [sorted_advancing_players[3],
             sorted_advancing_players[4],
             sorted_advancing_players[11],
             sorted_advancing_players[12]
            ]
        ]
        players_seed = {}
        for player_id in sorted_advancing_players:
            players_seed[player_id] = FinalsPlayer.query.filter_by(player_id=player_id).first().finals_seed
            print players_seed[player_id]
        for match in next_round_matches:
            players = FinalsPlayer.query.join(FinalsMatch).filter_by(match_id=match.match_id).all()            
            players_pair = ranked_players_pairs.pop()
            ranked_player_one_id=players_pair[0]
            ranked_player_two_id=players_pair[1]
            ranked_player_three_id=players_pair[2]
            ranked_player_four_id=players_pair[3]            
            player_one = players[0]
            player_two = players[1]
            player_three = players[2]
            player_four = players[3]
            print "player 1 id is %d" % ranked_player_one_id
            print "player 2 id is %d" % ranked_player_two_id
            print "player 3 id is %d" % ranked_player_three_id
            print "player 4 id is %d" % ranked_player_four_id            
            player_one.finals_seed = players_seed[ranked_player_one_id]
            player_two.finals_seed = players_seed[ranked_player_two_id]
            player_three.finals_seed = players_seed[ranked_player_three_id]
            player_four.finals_seed = players_seed[ranked_player_four_id]
            player_one.player_id=ranked_player_one_id
            player_two.player_id=ranked_player_two_id            
            player_three.player_id=ranked_player_three_id            
            player_four.player_id=ranked_player_four_id            
            DB.session.commit()
    #print "%d %s" % (finalsscore.match_id,all_scores_for_match_entered)
    return jsonify({})



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

    entry_results = DB.engine.execute("select entry_id, player_id, entry_score_sum, rank() over (order by entry_score_sum desc) from (select entry_id, player_id, sum(entry_score) as entry_score_sum  from (select entry.player_id, score.entry_id, testing_papa_scoring(rank() over (partition by division_machine_id order by score.score desc)) as entry_score from score,entry where score.entry_id = entry.entry_id and division_id = %s and completed = true and voided = false) as ss group by ss.entry_id, player_id order by entry_score_sum desc limit %d) as tt" % (division_id,num_players) )    
    ranked_players = []
    bye_players = [[0,7],[1,6],[2,5],[3,4]]
    normal_players = [[8,23,15,16],[9,22,14,17],[10,21,13,18],[11,20,12,19]]
    for player_result in entry_results:
        ranked_players.insert(0,player_result[1])

    matches_with_byes = FinalsMatch.query.filter_by(round_id=2,finals_id=finals.finals_id).all()        
    for match in matches_with_byes:
        players_with_byes = FinalsPlayer.query.join(FinalsMatch).filter_by(match_id=match.match_id).all()
        bye_players_pair = bye_players.pop()
        player_one=players_with_byes[0]
        player_two=players_with_byes[1]
        ranked_player_one=ranked_players[bye_players_pair[0]]
        ranked_player_two=ranked_players[bye_players_pair[1]]
        player_one.finals_seed = bye_players_pair[0]+1
        player_two.finals_seed = bye_players_pair[1]+1
        player_one.player_id = ranked_player_one
        player_two.player_id = ranked_player_two
    matches_without_byes = FinalsMatch.query.filter_by(round_id=1,finals_id=finals.finals_id).all()        
    for match in matches_without_byes:        
        players_without_byes = FinalsPlayer.query.join(FinalsMatch).filter_by(match_id=match.match_id).all()
        players_pair = normal_players.pop()
        player_one=players_without_byes[0]
        player_two=players_without_byes[1]
        player_three=players_without_byes[2]
        player_four=players_without_byes[3]
        ranked_player_one=ranked_players[players_pair[0]]
        ranked_player_two=ranked_players[players_pair[1]]
        ranked_player_three=ranked_players[players_pair[2]]
        ranked_player_four=ranked_players[players_pair[3]]        
        player_one.player_id=ranked_player_one
        player_one.finals_seed = players_pair[0]+1
        player_two.player_id=ranked_player_two
        player_two.finals_seed = players_pair[1]+1
        player_three.player_id=ranked_player_three
        player_three.finals_seed = players_pair[2]+1
        player_four.player_id=ranked_player_four       
        player_four.finals_seed = players_pair[3]+1
    DB.session.commit()
    return jsonify({})

