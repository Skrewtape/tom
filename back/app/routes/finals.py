import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Player, Division, Entry, Score, Tournament, Team, Finals, Machine, DivisionMachine, FinalsMatch,  FinalsPlayer, FinalsScore
from app.types import FinalsEx, FinalsMatchEx, FinalsPlayerEx, FinalsMatchResultEx, FinalsMatchResultScoreEx, FinalsMatchSlotEx
from app import App, Admin_permission, Desk_permission, Scorekeeper_permission, DB
from app.routes.util import fetch_entity, calculate_score_points_from_rank
from werkzeug.exceptions import Conflict
from flask_restless.helpers import to_dict
from sqlalchemy.sql import func
from operator import itemgetter
from app.routes.v1 import v1_utils
from ranking import Ranking
import challonge
from app import secret_config, tom_config

# @App.route('/finals/match/match_id/<match_id>', methods=['GET'])
# @fetch_entity(FinalsMatch, 'match')
# def get_match(match):
#     finals_match = FinalsMatch.query.filter_by(match_id=match.match_id).first()    
#     return jsonify(finals_match.to_dict_simple())

# @App.route('/finals/<finals_id>/match', methods=['GET'])
# @fetch_entity(Finals, 'finals')
# def get_matches_for_final(finals):
#     return shared_get_matches_for_final(finals)


# def get_finals_match_results(match_id):
#     query_string = "select finals_player_id, sum(rank) from (select finals_player_id, finals_papa_scoring(rank() over (partition by game_number order by score desc)) as rank from finals_score where match_id = %d  order by game_number) as tt group by finals_player_id order by sum(rank) desc"
#     return DB.engine.execute(query_string % (match_id))

# def shared_get_matches_for_final(finals):
#     matches_dict = {}
#     sorted_total_points = {}
#     losers={}
#     sorted_losers={}    
#     games={}

#     starting_loser_rank_in_round={1:17,2:9,3:5,4:1}
#     for round in range(finals.rounds):
#         round=round+1
#         matches_dict[round]={}
#         losers[round]={}
#         sorted_losers[round]=[]        
#     finals_matches = FinalsMatch.query.filter_by(finals_id=finals.finals_id)    

#     query_string = "select finals_player_id, sum(rank) from (select finals_player_id, finals_papa_scoring(rank() over (partition by game_number order by score desc)) as rank from finals_score where match_id = %d  order by game_number) as tt group by finals_player_id order by sum(rank) desc"
#     for match in finals_matches:        
#         game_1_results = DB.engine.execute(query_string % (match.match_id))
#         num_scores_in_match = FinalsScore.query.filter_by(match_id=match.match_id).filter(FinalsScore.score != None).count()        
#         match_dict = match.to_dict_simple()
#         total_games_finished=num_scores_in_match/4
#         match_dict['games']={0:[],1:[],2:[]}
#         for player in match.finals_players:
#             for score in player.finals_scores:
#                 match_dict['games'][score.game_number].append(score.to_dict_simple())      
#         if num_scores_in_match==12:            
#             winner_one = game_1_results.fetchone()
#             winner_two = game_1_results.fetchone()
#             loser_one = game_1_results.fetchone()
#             loser_two = game_1_results.fetchone()
#             if match.round_id == finals.rounds:
#                 match_dict['finals_players'][winner_one[0]]['status']="1st"
#                 match_dict['finals_players'][winner_two[0]]['status']="2nd"
#                 match_dict['finals_players'][loser_one[0]]['status']="3rd"
#                 match_dict['finals_players'][loser_two[0]]['status']="4th"            
                
#             else:
#                 match_dict['finals_players'][winner_one[0]]['status']="Proceed"
#                 match_dict['finals_players'][winner_two[0]]['status']="Proceed"            
#             for loser in [loser_one,loser_two]:
#                 if losers[match.round_id].has_key(loser[0]):
#                     losers[match.round_id][loser[0]]['player_score']=losers[match.round_id][loser[0]]['player_score']+loser[1]
#                 else:
#                     losers[match.round_id][loser[0]]={'player_id':loser[0],'player_score':loser[1],'match_id':match.match_id}            
#         else:
#             status="%d Games Completed" % total_games_finished
#             for (player_id,player) in match_dict['finals_players'].iteritems():
#                 player['status']=status                
#         matches_dict[match.round_id][match.match_id]=match_dict
#     for round in range(finals.rounds):                
#         round = round + 1
#         round_of_losers = []
#         for (player_id,loser) in losers[round].iteritems():
#             round_of_losers.append(loser)        
# sorted_losers[round] = sorted(round_of_losers, key=itemgetter('player_score'), reverse=True)        
        
#     for round in range(finals.rounds):                
#         round = round + 1        
#         for rank in range(len(sorted_losers[round])):
#             loser = sorted_losers[round][rank]            
#             match_id = loser['match_id']
#             if round != finals.rounds:
#                 matches_dict[round][match_id]['finals_players'][loser['player_id']]['status']="LOSER (finished %d)" % (starting_loser_rank_in_round[round]+rank)
#     return jsonify(matches_dict)


# @App.route('/finals', methods=['GET'])
# def get_all_active_finals():
#     finals = Finals.query.filter_by(active=True).all()
#     finals_dict = {'sorted_by_division_id':{},'sorted_by_finals_id':{}}
#     for final in finals:
#         finals_dict['sorted_by_division_id'][final.division_id]=final.to_dict_simple()
#     return jsonify(finals_dict)


# @Scorekeeper_permission.require(403)
# @login_required
# @App.route('/finals/machineId/<machine_id>/score/<finalsmatch_id>/game_num/<game_number>', methods=['POST'])
# @fetch_entity(Machine, 'machine')
# @fetch_entity(FinalsMatch, 'finalsmatch')
# def set_match_machine(machine, finalsmatch, game_number):
#     finals_scores = FinalsScore.query.filter_by(match_id=finalsmatch.match_id,game_number=game_number).all()
#     for finals_score in finals_scores:
#         new_division_machine = DivisionMachine(
#             machine_id=machine.machine_id,
#             finals_id=finalsmatch.finals_id
#         )
#         DB.session.add(new_division_machine)
#         DB.session.commit()        
#         finals_score.division_machine_id = new_division_machine.division_machine_id
#         DB.session.commit()
#     return jsonify({})

# @App.route('/finals/test')
# def test():
#     finals_matches = FinalsMatch.query.filter_by(finals_id=1,round_id=1).all()
#     for match in finals_matches:        
#         match_results = get_finals_match_results(finals_match.match_id)
#         winner_one = match_results.fetchone()
#         winner_two = match_results.fetchone()
#         print "match id is %s and winner_one id is %s " % (match.match_id,winner_one[0])        
#     return jsonify({})

    

# def get_players_ranked_by_qualifying(division_id,num_players):
#     entry_results = DB.engine.execute("select entry_id, player_id, entry_score_sum, rank() over (order by entry_score_sum desc) from (select entry_id, player_id, sum(entry_score) as entry_score_sum  from (select entry.player_id, score.entry_id, testing_papa_scoring(rank() over (partition by division_machine_id order by score.score desc)) as entry_score from score,entry where score.entry_id = entry.entry_id and division_id = %s and completed = true and voided = false) as ss group by ss.entry_id, player_id order by entry_score_sum desc limit %d) as tt" % (division_id,num_players) )    
#     ranked_players = []
#     for player_result in entry_results:
#         ranked_players.append(player_result)
#     return ranked_players

# def generate_ranking_list(playerlist=None,num_players_per_group=4):
#     if playerlist is not None and len(playerlist) == 0:
#         return []
#     if playerlist is not None and len(playerlist) == 2 and num_players_per_group==2:
#         return [playerlist]
#     if playerlist is not None and len(playerlist) == 4 and num_players_per_group==4:
#         return [playerlist]    
#     player_group = []
#     if num_players_per_group == 4:
#         player_group.append(playerlist.pop(len(playerlist)/2))
#         player_group.append(playerlist.pop(len(playerlist)/2))        
#     player_group.append(playerlist.pop(0))
#     player_group.append(playerlist.pop())   
#     return [player_group]+generate_ranking_list(playerlist, num_players_per_group)
        

# def get_finals_player_seed(finals_player_id):
#     return FinalsPlayer.query.filter_by(finals_player_id=finals_player_id).first()

# @Scorekeeper_permission.require(403)
# @login_required
# @App.route('/finals/finals_score/<finalsscore_id>/score/<score>', methods=['POST'])
# @fetch_entity(FinalsScore, 'finalsscore')
# def set_match_score(finalsscore, score):
#     finals_score = FinalsScore.query.filter_by(finals_player_score_id=finalsscore.finals_player_score_id).first()
#     finals_score.score = score
#     DB.session.commit()
#     finals_match = FinalsMatch.query.filter_by(match_id=finals_score.match_id).first()
#     finals_scores = FinalsScore.query.join(FinalsMatch).filter_by(finals_id=finals_match.finals_id,round_id=finals_match.round_id).all()
#     all_scores_for_match_entered=True
#     for all_finals_score in finals_scores:
#         if all_finals_score.score is None:
#             all_scores_for_match_entered=False
    
#     finals_matches = FinalsMatch.query.filter_by(finals_id=finals_match.finals_id,round_id=finals_match.round_id).all()
#     next_round_matches = FinalsMatch.query.filter_by(finals_id=finals_match.finals_id,round_id=finals_match.round_id+1).all()    

#     if all_scores_for_match_entered is False:
#         return jsonify({})
#     if finals_match.round_id==4:
#         return jsonify({})
#     advancing_players=[]
#     for match in finals_matches:        
#         match_results = get_finals_match_results(match.match_id)
#         winner_one_player_id = match_results.fetchone()[0]
#         winner_one = FinalsPlayer.query.filter_by(finals_player_id=winner_one_player_id).first()
#         winner_two_player_id = match_results.fetchone()[0]
#         winner_two = FinalsPlayer.query.filter_by(finals_player_id=winner_two_player_id).first()        
#         advancing_players.append({'player_id':winner_one.player_id,'finals_seed':winner_one.finals_seed})
#         advancing_players.append({'player_id':winner_two.player_id,'finals_seed':winner_two.finals_seed})
        
#     for match in next_round_matches:        
#         for finals_player in match.finals_players:
#             if finals_player.player_id is not None:                
#                 advancing_players.append({'player_id':finals_player.player_id,'finals_seed':finals_player.finals_seed})
#     sorted_advancing_players = sorted(advancing_players,key=lambda x:x['finals_seed'])
#     advancing_players_groups=generate_ranking_list(sorted_advancing_players,4)        
    
#     for player_group in advancing_players_groups:
#         for player in player_group:
#             print player['finals_seed']
#         print "---"
#     for match in next_round_matches:
#         bobo_player_group = advancing_players_groups.pop()
#         for finals_player in match.finals_players:
#             bobo_player = bobo_player_group.pop()
#             print "setting %d %d" %(bobo_player['player_id'],bobo_player['finals_seed'])
#             finals_player.player_id = bobo_player['player_id']
#             finals_player.finals_seed = bobo_player['finals_seed']
#             DB.session.commit()
#     return jsonify({})


# #@Scorekeeper_permission.require(403)
# #@login_required
# @App.route('/finals/division/<division_id>', methods=['POST'])
# @fetch_entity(Division, 'division')
# def create_finals(division):
#     new_finals = Finals(
#         division_id=division.division_id,
#         active=True,
#         rounds=0
#         )
#     DB.session.add(new_finals)
#     DB.session.commit()
#     return jsonify(to_dict(new_finals))

# @Scorekeeper_permission.require(403)
# @login_required
# @App.route('/finals/<finals_id>/division_machine/<machine_id>', methods=['POST'])
# @fetch_entity(Finals, 'finals')
# @fetch_entity(Machine, 'machine')
# def create_finals_division_machine(finals,machine):
#     new_division_machine = DivisionMachine(
#         machine_id=machine.machine_id,
#         finals_id=finals.finals_id
#     )
#     DB.session.add(new_division_machine)
#     DB.session.commit()
#     return jsonify(to_dict(new_division_machine))

# @App.route('/finals/<finals_id>/division_machines', methods=['GET'])
# @fetch_entity(Finals, 'finals')
# def get_finals_division_machine(finals):
#     finals_division_machines = {}
#     for division_machine in finals.division_machines:
#         finals_division_machines[division_machine.division_machine_id]=to_dict(division_machine)
#         finals_division_machines[division_machine.division_machine_id]['name']=division_machine.machine.name        
#     return jsonify(finals_division_machines)

# def new_finals_player(num_per_group, match_id):
#     for player_num in range(num_per_group):
#         finals_player_root = FinalsPlayer(
#             match_id = match_id
#         )
#         DB.session.add(finals_player_root)
#     DB.session.commit()

# def gen_finals_score(match_id):
#     finals_players = FinalsPlayer.query.filter_by(match_id=match_id).all()
#     for finals_player in finals_players:
#         for game_number in range(3):
#             new_finals_score = FinalsScore(
#                 match_id=match_id,
#                 finals_player_id=finals_player.finals_player_id,
#                 game_number=game_number
#             )
#             DB.session.add(new_finals_score)
#     DB.session.commit()
    
# def gen_finals_match(round_id,finals_id,match_with_byes=False):
#     # FIXME : num_per_group should be passed in
#     num_per_group=2
#     new_finals_match = FinalsMatch(
#         round_id=round_id,
#         finals_id=finals_id,
#         match_with_byes=False
#     )
#     if match_with_byes:
#         new_finals_match.match_with_byes=True
#     DB.session.add(new_finals_match)
#     DB.session.commit()
#     new_finals_player(num_per_group,new_finals_match.match_id)
#     gen_finals_score(new_finals_match.match_id)
#     return new_finals_match

# @Scorekeeper_permission.require(403)
# @login_required
# @App.route('/finals/<finals_id>/generate_rounds', methods=['POST'])
# @fetch_entity(Finals, 'finals')
# def generate_finals_rounds(finals):
#     last_bye_round = 2
#     num_players = 24
#     players_per_group = 4
#     num_bye_rounds = 1
#     num_per_group = 4
#     num_rounds = ((num_players/num_per_group)/2) + num_bye_rounds
#     finals.rounds = num_rounds
#     DB.session.commit()
#     num_byes_per_round = (num_players/3)
#     cur_round_matches=[]
#     next_round_matches=[]

#     new_finals_match = gen_finals_match(num_rounds,finals.finals_id)
#     cur_round_matches.append(new_finals_match)    
        
#     for round in range(num_rounds,1,-1):
#         child_round = round - 1
#         for match in cur_round_matches:            
#             if child_round >= last_bye_round:
#                 if child_round<=last_bye_round and child_round != 1:
#                     set_bye=True
#                 else:
#                     set_bye=False
#                 new_finals_match_left_child = gen_finals_match(child_round,finals.finals_id, set_bye)
#                 new_finals_match_right_child = gen_finals_match(child_round,finals.finals_id, set_bye)                    
#                 next_round_matches.append(new_finals_match_right_child)
#                 next_round_matches.append(new_finals_match_left_child)
#             if child_round < last_bye_round:
#                 if child_round != 1:
#                     set_bye=True
#                 else:
#                     set_bye=False
#                 new_finals_match_child = gen_finals_match(child_round,finals.finals_id, set_bye)                    
#                 next_round_matches.append(new_finals_match_child)
#         cur_round_matches = next_round_matches
#         next_round_matches = []
#     return jsonify({})

# #@Scorekeeper_permission.require(403)
# #@login_required
# @App.route('/finals/<finals_id>/generate_head_to_head_rounds', methods=['POST'])
# @fetch_entity(Finals, 'finals')
# def generate_head_to_head_finals_rounds(finals):
#     #FIXME : this should all be passed in
#     last_bye_round = 2
#     num_players = 4
#     players_per_group = 2
#     num_bye_rounds = 0
#     num_per_group = 2
#     #num_rounds = ((num_players/num_per_group)/2) + num_bye_rounds
#     num_rounds = ((num_players/num_per_group)) + num_bye_rounds
#     finals.rounds = num_rounds
#     DB.session.commit()
#     if num_bye_rounds > 0:
#         num_byes_per_round = (num_players/3)
#     else:
#         num_byes_per_round = 0
#     cur_round_matches=[]
#     next_round_matches=[]

#     new_finals_match = gen_finals_match(num_rounds,finals.finals_id)
#     cur_round_matches.append(new_finals_match)    
        
#     for round in range(num_rounds,1,-1):
#         child_round = round - 1
#         for match in cur_round_matches:            
#             if child_round >= last_bye_round:
#                 if child_round<=last_bye_round and child_round != 1:
#                     set_bye=True
#                 else:
#                     set_bye=False
#                 new_finals_match_left_child = gen_finals_match(child_round,finals.finals_id, set_bye)
#                 new_finals_match_right_child = gen_finals_match(child_round,finals.finals_id, set_bye)                    
#                 next_round_matches.append(new_finals_match_right_child)
#                 next_round_matches.append(new_finals_match_left_child)
#             if child_round < last_bye_round:
#                 if child_round != 1:
#                     set_bye=True
#                 else:
#                     set_bye=False
#                 new_finals_match_child = gen_finals_match(child_round,finals.finals_id, set_bye)                    
#                 next_round_matches.append(new_finals_match_child)
#         cur_round_matches = next_round_matches
#         next_round_matches = []
#     return jsonify({})


# @Scorekeeper_permission.require(403)
# @login_required
# @App.route('/finals/<finals_id>/checked_player_list/<checked_players>/fill_rounds', methods=['POST'])
# @fetch_entity(Finals, 'finals')
# def fill_finals_rounds(finals,checked_players):
#     division_id = finals.division_id
#     last_bye_round = 2
#     num_players = 24
#     players_per_group = 4
#     num_bye_rounds = 1
#     num_per_group = 4
#     num_rounds = ((num_players/num_per_group)/2) + num_bye_rounds
#     num_byes_per_round = (num_players/3)
#     cur_round_matches=[]
#     next_round_matches=[]    
#     bye_players = generate_ranking_list(v1_utils.get_players_ranked_by_qualifying(division_id,8,checked_players=checked_players)[:8],2)
#     normal_players=generate_ranking_list(v1_utils.get_players_ranked_by_qualifying(division_id,24,checked_players=checked_players)[8:24],4)        
#     matches_with_byes = FinalsMatch.query.filter_by(round_id=2,finals_id=finals.finals_id).all()        
#     for match in matches_with_byes:
#         bye_players_pair = bye_players.pop()
#         for index, bye_player_info in enumerate(bye_players_pair):
#             db_bye_player = match.finals_players[index]            
#             db_bye_player.player_id = bye_player_info[1]
#             db_bye_player.finals_seed = bye_player_info[3]                        
#     matches_without_byes = FinalsMatch.query.filter_by(round_id=1,finals_id=finals.finals_id).all()        
#     for match in matches_without_byes:
#         normal_players_pair = normal_players.pop()
#         for index, normal_player_info in enumerate(normal_players_pair):
#             db_normal_player = match.finals_players[index]            
#             db_normal_player.player_id = normal_player_info[1]
#             db_normal_player.finals_seed = normal_player_info[3]                                
#     DB.session.commit()
#     return jsonify({})

@App.route('/finals_match_ex/finals_match_ex_id/<finals_match_ex_id>', methods=['GET'])
@fetch_entity(FinalsMatchEx, 'finals_match_ex')
def get_match_ex(finals_match_ex):    
    return jsonify(finals_match_ex.to_dict_complete())

@App.route('/finals_ex/<finals_ex_id>/match', methods=['GET'])
@fetch_entity(FinalsEx, 'finals_ex')
def get_matches_for_final_ex(finals_ex):
    return jsonify(finals_ex.to_dict_with_matches())
    #return shared_get_matches_for_final(finals)


@App.route('/finals_ex/<finals_ex_id>', methods=['GET'])
@fetch_entity(FinalsEx, 'finals_ex')
def get_finals_ex(finals_ex):
    return jsonify(finals_ex.to_dict_simple())

@App.route('/finals_ex', methods=['GET'])
def get_all_activefinals_ex():
    finals_exs = FinalsEx.query.all()    
    all_active_finals_ex = {f.finals_ex_id: f.to_dict_simple() for f in finals_exs} #[f.to_dict_simple() for f in finals_exs]    
    return jsonify(to_dict(all_active_finals_ex))

@Scorekeeper_permission.require(403)
@login_required
@App.route('/finals_match_ex/finals_match_ex_id/<finals_match_ex_id>', methods=['PUT'])
@fetch_entity(FinalsMatchEx,'finals_match_ex')
def set_finals_match_ex(finals_match_ex):
    finals_match_ex.match_state = json.loads(request.data)['match_state']
    DB.session.commit()
    return jsonify(finals_match_ex.to_dict_complete())

#@Scorekeeper_permission.require(403)
#@login_required
# @App.route('/finals_ex/finals_ex_id/<finals_ex_id>/round_number/<round_number>', methods=['PUT'])
# @fetch_entity(FinalsEx,'finals_ex')
# def set_finals_round_rankings(finals_ex,round_number):
#     #if "match_state" in 
#     #finals_match_ex.match_state = json.loads(request.data)['match_state']
#     player_rankings = calculate_round_final_rankings(finals_ex,round_number)
#     #print player_rankings
#     DB.session.commit()
#     return jsonify({})


@Scorekeeper_permission.require(403)
@login_required
@App.route('/finals_match_ex/in_progress/finals_match_ex_id/<finals_match_ex_id>', methods=['PUT'])
@fetch_entity(FinalsMatchEx,'finals_match_ex')
def set_finals_match_in_progress_ex(finals_match_ex):
    finals_match_ex.match_state = "In Progress"
    DB.session.commit()
    return jsonify(finals_match_ex.to_dict_complete())

@Scorekeeper_permission.require(403)
@login_required
@App.route('/finals_match_result_ex/machine/finals_match_result_ex_id/<finals_match_result_ex_id>/machine_id/<machine_id>', methods=['PUT'])
@fetch_entity(FinalsMatchResultEx,'finals_match_result_ex')
@fetch_entity(Machine,'machine')
def set_finals_match_result_ex_machine(finals_match_result_ex,machine):
    finals_match_result_ex.finals_machine_id = machine.machine_id    
    DB.session.commit()
    return jsonify(finals_match_result_ex.to_dict_with_scores())

@Scorekeeper_permission.require(403)
@login_required
@App.route('/finals_match_tiebreaker/finals_match_ex_id/<finals_match_ex_id>', methods=['PUT'])
@fetch_entity(FinalsMatchEx,'finals_match_ex')
def resolve_finals_match_tiebreaker_ex(finals_match_ex):
    finals_match_ex.match_state="Finished"
    sorted_player_points = calculate_sorted_player_points(finals_match_ex)
    set_player_advanced(finals_match_ex,sorted_player_points)
    DB.session.commit()
    return jsonify(finals_match_ex.to_dict_complete())
 

@Scorekeeper_permission.require(403)
@login_required
@App.route('/finals_match_result_ex/finals_match_result_ex_id/<finals_match_result_ex_id>', methods=['PUT'])
@fetch_entity(FinalsMatchResultEx,'finals_match_result_ex')
def set_finals_match_result_ex(finals_match_result_ex):
    result_data = json.loads(request.data)
    if 'finals_machine' in result_data:
        finals_match_result_ex.finals_machine_id = result_data['finals_machine']['machine_id']        
    for submitted_score in result_data['scores']:        
        score=FinalsMatchResultScoreEx.query.filter_by(finals_match_result_score_ex_id=submitted_score['finals_match_result_score_ex_id']).first()        
        if submitted_score['score'] is not null:
            score.score = submitted_score['score']
        if submitted_score['finals_player_ex_id']:
            score.finals_player_ex_id = submitted_score['finals_player_ex_id']
    score_count = (1 for s in result_data['scores'] if s.get('score') is not None)
    if sum(score_count) == len(result_data['scores']) and finals_match_result_ex.result_state != "scores_recorded":
        finals_match_result_ex.result_state = "scores_recorded"
    
    DB.session.commit()        
    if result_data['result_state'] != "finished":
        return jsonify(finals_match_result_ex.to_dict_with_scores())    
    scores = FinalsMatchResultScoreEx.query.filter_by(finals_match_result_ex_id = finals_match_result_ex.finals_match_result_ex_id).order_by(FinalsMatchResultScoreEx.score.asc()).all()
    calculate_finals_match_result_points(scores)
    finals_match = FinalsMatchEx.query.filter_by(finals_match_ex_id = finals_match_result_ex.finals_match_ex_id).first()
    finals_match_result_ex.result_state = "finished"
    DB.session.commit()

    sorted_player_points = calculate_sorted_player_points(finals_match)    
    
    for result in finals_match.finals_match_result_ex:
        if result.result_state != "finished":            
            return jsonify(finals_match_result_ex.to_dict_with_scores())        
    if len(finals_match.finals_match_slot_ex) == 2:        
        calculate_player_match_points(finals_match.finals_match_slot_ex[0].finals_player_ex_id,finals_match)
        
    if len(finals_match.finals_match_slot_ex) == 4:
        # player_points = []
        
        # first_player_id = finals_match.finals_match_slot_ex[0].finals_player_ex_id
        # second_player_id = finals_match.finals_match_slot_ex[1].finals_player_ex_id
        # third_player_id = finals_match.finals_match_slot_ex[2].finals_player_ex_id
        # fourth_player_id = finals_match.finals_match_slot_ex[3].finals_player_ex_id        

        # first_player_points = calculate_player_match_points(first_player_id,finals_match_result_ex)
        # second_player_points = calculate_player_match_points(second_player_id,finals_match_result_ex)
        # third_player_points = calculate_player_match_points(third_player_id,finals_match_result_ex)
        # fourth_player_points = calculate_player_match_points(fourth_player_id,finals_match_result_ex)

        # player_points.append({'player_id':first_player_id,'points':first_player_points})
        # player_points.append({'player_id':second_player_id,'points':second_player_points})
        # player_points.append({'player_id':third_player_id,'points':third_player_points})
        # player_points.append({'player_id':fourth_player_id,'points':fourth_player_points})
        
        # sorted_player_points = sorted(player_points, key=itemgetter('points'), reverse=True)                

        # sorted_player_points = calculate_sorted_player_points(first_player_id,second_player_id,third_player_id,fourth_player_id)

        first_place_points = sorted_player_points[0]['points']
        second_place_points = sorted_player_points[1]['points']
        third_place_points = sorted_player_points[2]['points']
        fourth_place_points = sorted_player_points[3]['points']
  
        if first_place_points == fourth_place_points:            
            q = FinalsMatchSlotEx.query.filter_by(finals_match_ex_id = finals_match.finals_match_ex_id)
            q.filter_by(finals_player_ex_id=sorted_player_points[0]['player_id']).first().tie_breaker=True
            q.filter_by(finals_player_ex_id=sorted_player_points[1]['player_id']).first().tie_breaker=True
            q.filter_by(finals_player_ex_id=sorted_player_points[2]['player_id']).first().tie_breaker=True
            q.filter_by(finals_player_ex_id=sorted_player_points[3]['player_id']).first().tie_breaker=True            
            #finals_match.finals_match_slot_ex[0].tie_breaker=True            
            #finals_match.finals_match_slot_ex[1].tie_breaker=True            
            #finals_match.finals_match_slot_ex[2].tie_breaker=True            
            #finals_match.finals_match_slot_ex[3].tie_breaker=True
            DB.session.commit()
            return jsonify(finals_match_result_ex.to_dict_with_scores())                        
        if first_place_points == third_place_points:            
            q = FinalsMatchSlotEx.query.filter_by(finals_match_ex_id = finals_match.finals_match_ex_id)
            q.filter_by(finals_player_ex_id=sorted_player_points[0]['player_id']).first().tie_breaker=True
            q.filter_by(finals_player_ex_id=sorted_player_points[1]['player_id']).first().tie_breaker=True
            q.filter_by(finals_player_ex_id=sorted_player_points[2]['player_id']).first().tie_breaker=True

            #finals_match.finals_match_slot_ex[0].tie_breaker=True            
            #finals_match.finals_match_slot_ex[1].tie_breaker=True            
            #finals_match.finals_match_slot_ex[2].tie_breaker=True                        
            DB.session.commit()
            return jsonify(finals_match_result_ex.to_dict_with_scores())                        
        if second_place_points == fourth_place_points:            
            q = FinalsMatchSlotEx.query.filter_by(finals_match_ex_id = finals_match.finals_match_ex_id)
            q.filter_by(finals_player_ex_id=sorted_player_points[1]['player_id']).first().tie_breaker=True
            q.filter_by(finals_player_ex_id=sorted_player_points[2]['player_id']).first().tie_breaker=True
            q.filter_by(finals_player_ex_id=sorted_player_points[3]['player_id']).first().tie_breaker=True

            #finals_match.finals_match_slot_ex[1].tie_breaker=True            
            #finals_match.finals_match_slot_ex[2].tie_breaker=True
            #finals_match.finals_match_slot_ex[3].tie_breaker=True                                                
            DB.session.commit()
            return jsonify(finals_match_result_ex.to_dict_with_scores())
        if second_place_points == third_place_points:
            q = FinalsMatchSlotEx.query.filter_by(finals_match_ex_id = finals_match.finals_match_ex_id)
            q.filter_by(finals_player_ex_id=sorted_player_points[1]['player_id']).first().tie_breaker=True
            q.filter_by(finals_player_ex_id=sorted_player_points[2]['player_id']).first().tie_breaker=True
            
            #finals_match.finals_match_slot_ex[1].tie_breaker=True            
            #finals_match.finals_match_slot_ex[2].tie_breaker=True                        
            DB.session.commit()
            return jsonify(finals_match_result_ex.to_dict_with_scores())
    finals_match.match_state="Finished"
    set_player_advanced(finals_match,sorted_player_points)
    DB.session.commit()
    return jsonify(finals_match_result_ex.to_dict_with_scores())
    
def calculate_round_final_rankings(finals_ex, round):
    #slots = FinalsMatchSlotEx.query.filter_by(round_number = round).join(FinalsMatchEx).filter_by(finals_ex_id = finals_ex.finals_ex_id).all()
    matches = FinalsMatchEx.query.filter_by(round_number = round,finals_ex_id = finals_ex.finals_ex_id).all()    
    #calculate_player_match_points(first_player_id,finals_match)
    player_round_points = []
    for match in matches:
        slots_in_match = match.finals_match_slot_ex                
        sorted_points = calculate_sorted_player_points(match)
        for player_points in sorted_points:
            player_round_points.append(player_points)

    sorted_list =  sorted(player_round_points, key=itemgetter('points'))
    #sorted_list =  sorted(player_round_points, key=lambda pp: pp['points'], reverse=True)
    #ranked_list =  list(Ranking(sorted_list,key=lambda pp: int(pp['points'])))
    #print ranked_list
    pruned_list = []
    for sorted_item in sorted_list:
        slot = FinalsMatchSlotEx.query.filter_by(finals_player_ex_id=sorted_item['player_id']).join(FinalsMatchEx).filter_by(finals_ex_id = finals_ex.finals_ex_id,round_number = round).first()
        if slot.result != "Advance":
            pruned_list.append(sorted_item)
    ranked_list =  list(Ranking(pruned_list,key=lambda pp: int(pp['points']),reverse=True))            
    for ranked_item in ranked_list:
        slot = FinalsMatchSlotEx.query.filter_by(finals_player_ex_id=ranked_item[1]['player_id']).join(FinalsMatchEx).filter_by(finals_ex_id = finals_ex.finals_ex_id,round_number = round).first()
        if slot.result != "Advance":
            #if round == 1:
            #    starting_rank = finals_ex.num_players
            #else:                
            slots = FinalsMatchSlotEx.query.filter_by(result="Advance").join(FinalsMatchEx).filter_by(finals_ex_id = finals_ex.finals_ex_id).filter(FinalsMatchEx.round_number < round).all()
            
            if round == 1:
                starting_rank = finals_ex.num_players
            else:
                starting_rank = finals_ex.num_players - sum((1 for slot_count in slots))
            # round 1 - total qualifiers - rank
            # round 2 - total_qualifiers - (num_matches_in (nround - 1) round * num_players_per_match)/2 - rank
            # round 3 - total qualifiers 
            #this should be num_players in the first round
            # in all subsequent rounds it should be the num_players - players in all previous rounds (i.e. round 2 is 24 - 8)
            
            slot.final_rank = starting_rank - (ranked_item[0])
    DB.session.commit()
    return ranked_list

    # for slot in slots:
    #     finals_player_ex_id = slot.finals_player_ex_id
    #     player_points = FinalsMatchRe
    #     pass
    
#def calculate_sorted_player_points(finals_match,finals_match_result_ex):
def calculate_sorted_player_points(finals_match):
    player_points = []

    num_players_in_round = sum((1 for slot in finals_match.finals_match_slot_ex))
    
    first_player_id = finals_match.finals_match_slot_ex[0].finals_player_ex_id
    second_player_id = finals_match.finals_match_slot_ex[1].finals_player_ex_id    
    first_player_points = calculate_player_match_points(first_player_id,finals_match)
    second_player_points = calculate_player_match_points(second_player_id,finals_match)

    player_points.append({'player_id':first_player_id,
                          'points':first_player_points,
                          'tie_breaker_result':finals_match.finals_match_slot_ex[0].tie_breaker_result,
                          'slot_result':finals_match.finals_match_slot_ex[0].result})
    player_points.append({'player_id':second_player_id,
                          'points':second_player_points,
                          'tie_breaker_result':finals_match.finals_match_slot_ex[1].tie_breaker_result,
                          'slot_result':finals_match.finals_match_slot_ex[1].result})
    if num_players_in_round > 2:
        third_player_id = finals_match.finals_match_slot_ex[2].finals_player_ex_id
        fourth_player_id = finals_match.finals_match_slot_ex[3].finals_player_ex_id        
        third_player_points = calculate_player_match_points(third_player_id,finals_match)
        fourth_player_points = calculate_player_match_points(fourth_player_id,finals_match)

        player_points.append({'player_id':third_player_id,
                              'points':third_player_points,
                              'tie_breaker_result':finals_match.finals_match_slot_ex[2].tie_breaker_result,
                              'slot_result':finals_match.finals_match_slot_ex[2].result})
        player_points.append({'player_id':fourth_player_id,
                              'points':fourth_player_points,
                              'tie_breaker_result':finals_match.finals_match_slot_ex[3].tie_breaker_result,
                              'slot_result':finals_match.finals_match_slot_ex[3].result})
        
    return sorted(player_points, key=itemgetter('points','tie_breaker_result'), reverse=True)

def set_player_advanced(finals_match, sorted_player_points):
    round = FinalsMatchEx.query.filter_by(finals_match_ex_id=finals_match.finals_match_ex_id).first().round_number
    total_rounds = FinalsEx.query.filter_by(finals_ex_id=finals_match.finals_ex_id).first().rounds
    if total_rounds == round:
        return
    for idx in range(0,len(sorted_player_points)/2):
        player_points = sorted_player_points[idx]
        slot = FinalsMatchSlotEx.query.filter_by(finals_match_ex_id=finals_match.finals_match_ex_id,finals_player_ex_id=player_points['player_id']).first()
        slot.result="Advance"
    DB.session.commit()
    

def calculate_player_match_points(finals_player_ex_id, match):
    query_results = FinalsMatchResultScoreEx.query.filter_by(finals_player_ex_id=finals_player_ex_id).join(FinalsMatchResultEx).filter_by(finals_match_ex_id=match.finals_match_ex_id).all()
    score_count = (r.rank for r in query_results)
    return sum(score_count)
    

def calculate_finals_match_result_points(scores):    
    rank = 1
    for score in scores:
#        score.rank = 1
        score.rank = rank        
#        if rank == 2 or rank == 3:
#            score.rank = 2
#        if rank == 4 :
#            score.rank = 3            
        rank = rank + 1            
        DB.session.commit()

@Scorekeeper_permission.require(403)
@login_required
@App.route('/finals_match_slot_ex', methods=['PUT'])
def set_finals_match_slots_ex():
    slots = json.loads(request.data)
    for request_slot in slots:
        slot = FinalsMatchSlotEx.query.filter_by(finals_match_slot_ex_id=request_slot['finals_match_slot_ex_id']).first()
        slot.tie_breaker_result = request_slot['tie_breaker_result']
        slot.tie_breaker = request_slot['tie_breaker']
    DB.session.commit()
    return jsonify({})

#@Scorekeeper_permission.require(403)
#@login_required
@App.route('/finals_match_slot_ex/finals_match_ex_id/<finals_match_ex_id>', methods=['GET'])
@fetch_entity(FinalsMatchEx,'finals_match_ex')
def get_finals_match_slots_ex(finals_match_ex):
    return jsonify({'slots':[slot.to_dict_simple() for slot in finals_match_ex.finals_match_slot_ex]})


@Scorekeeper_permission.require(403)
@login_required
@App.route('/finals_match_result_score_ex/finals_match_result_score_ex_id/<finals_match_result_score_ex_id>', methods=['PUT'])
@fetch_entity(FinalsMatchResultScoreEx,'finals_match_result_score_ex')
def set_finals_match_result_score_ex(finals_match_result_score_ex):
    if(json.loads(request.data)['score']):
        finals_match_result_score_ex.score = json.loads(request.data)['score']
    if(json.loads(request.data)['finals_player_ex_id']):
        finals_match_result_score_ex.finals_player_ex_id = json.loads(request.data)['finals_player_ex_id']    
    finals_match_result_ex = FinalsMatchResultEx.query.filter_by(finals_match_result_ex_id=finals_match_result_score_ex.finals_match_result_ex_id).first()
    finals_match_result_ex.num_scores_recorded = finals_match_result_ex.num_scores_recorded + 1
    DB.session.commit()
    return jsonify(finals_match_result_score_ex.to_dict_simple())

#@Scorekeeper_permission.require(403)
#@login_required
@App.route('/finals_ex/division/<division_id>/num_players/<num_players>/num_players_per_group/<num_players_per_group>/num_games_per_match/<num_games_per_match>/description/<description>', methods=['POST'])
@fetch_entity(Division, 'division')
def create_finals_ex(division,num_players,num_players_per_group,num_games_per_match,description):
    if description == "none":
        description = None
    new_finals_ex = FinalsEx(
        division_id=division.division_id,
        active=True,
        rounds=0,
        num_players=num_players,
        num_players_per_group=num_players_per_group,
        num_games_per_match = num_games_per_match,
        description = description
        )
    DB.session.add(new_finals_ex)
    DB.session.commit()
    return jsonify(to_dict(new_finals_ex))

def create_match_2_player_groups(round,finals_ex_id):
    
    round_matches = FinalsMatchEx.query.filter_by(round_number=round,finals_ex_id=finals_ex_id).all()
    children_groups = []
    for match in round_matches:
        print "==new match=="
        child_match_one = FinalsMatchEx.query.filter_by(finals_match_ex_id=match.child_match_id_one).first()
        print "child one id is %s " % child_match_one.finals_match_ex_id
        child_match_two = None
        children_players = []
        for slot in child_match_one.finals_match_slot_ex:
            print "slot result is %s for slot_id %s" % (slot.result,slot.finals_match_slot_ex_id)
            if slot.result == "Advance":
                print "advancing player found"
                children_players.append(slot.finals_player_ex)
        if match.child_match_id_two is not None:
            child_match_two = FinalsMatchEx.query.filter_by(finals_match_ex_id=match.child_match_id_two).first()

        if child_match_two is not None:            
            for slot in child_match_two.finals_match_slot_ex:
                if slot.result == "Advance":
                    children_players.append(slot.finals_player_ex)
        else:
            for bye_player in match.bye_players:                
                print "adding bye player in match %s" % match.finals_match_ex_id
                children_players.append(bye_player)
        print children_players
        print "above is id %s " % match.finals_match_ex_id
        children_groups.append(children_players)
    return children_groups

def create_match_player_groups(match_player_rankings, players_per_group):
    
    groups = []
    length = len(match_player_rankings)
    num_groups = length / players_per_group
    starting_point = 0
    halfway_point_2 = len(match_player_rankings)/2
    halfway_point = halfway_point_2 - 1
    ending_point = length - 1
    for group_num in range(0,num_groups):
        if players_per_group == 4:
            groups.append([match_player_rankings[starting_point],match_player_rankings[halfway_point],match_player_rankings[halfway_point_2],match_player_rankings[ending_point]])
            halfway_point = halfway_point - 1
            halfway_point_2 = halfway_point_2 + 1
        if players_per_group == 2:
            groups.append([match_player_rankings[starting_point],match_player_rankings[ending_point]])
        if players_per_group == 1:
            groups.append([match_player_rankings[starting_point]])                        
        starting_point = starting_point + 1
        ending_point = ending_point - 1
    return groups

@App.route('/finals_ex/rounds/fill/finals_ex/<finals_ex_id>/round/<round_number>', methods=['PUT'])
def fill_round_ex(finals_ex_id,round_number):        
    finals_ex = FinalsEx.query.filter_by(finals_ex_id=finals_ex_id).first()   
    player_rankings = calculate_round_final_rankings(finals_ex,int(round_number))
    round_number = int(round_number)+1
    DB.session.commit()
    if round_number - 1 == finals_ex.rounds:
        return jsonify({})
    num_players = finals_ex.num_players
    num_players_per_group = finals_ex.num_players_per_group    
    
    next_round_matches = FinalsMatchEx.query.filter_by(finals_ex_id=finals_ex_id,round_number=round_number).all()
    next_round_player_list = []
    for match in next_round_matches:
        for bye_player in match.bye_players:
            next_round_player_list.append(bye_player)
    this_round_matches = FinalsMatchEx.query.filter_by(finals_ex_id=finals_ex_id,round_number=int(round_number)-1).all()
    for match in this_round_matches:
        for slot in match.finals_match_slot_ex:
            if slot.result == "Advance":
                next_round_player_list.append(slot.finals_player_ex)
    checked_player_groups = None
    if finals_ex.num_players_per_group == 4:
        checked_player_groups = create_match_player_groups(sorted(next_round_player_list,key=lambda p: p.seed),num_players_per_group)
    else:
        checked_player_groups = create_match_2_player_groups(round_number,finals_ex_id)    
    for match in next_round_matches:
        
        player_group = checked_player_groups.pop()        
        for slot in match.finals_match_slot_ex:                                    
            player = player_group.pop()
            #print player.finals_player_ex_id
            slot.finals_player_ex_id = player.finals_player_ex_id
            DB.session.commit()    
        for bye_player in [b for b in match.bye_players]:
            match.bye_players.remove(bye_player)
        DB.session.commit()                
    return jsonify({})


def create_and_fill_challonge(tournament_name,checked_player_list):
    #checked_player_list = [p for p in json.loads(request.data)['checked_players'] if "checked" in p and p['checked']]
    challonge.set_credentials(secret_config.challonge_user_name, secret_config.challonge_api_key)    
    tournament_created = challonge.tournaments.create(tournament_name,tournament_name.replace(" ",""))
    for player_dict in checked_player_list:
        #print "%s %s" % (player['player_id'],player['rank'])
        player = Player.query.filter_by(player_id=int(player_dict['player_id'])).first()
        player_created = challonge.participants.create(tournament_created['id'],"%s %s" % (player.first_name,player.last_name),seed=int(player_dict['rank']))
    challonge.tournaments.start(tournament_created['id'])
    
@App.route('/finals_ex/rounds/fill_init/finals_ex/<finals_ex_id>', methods=['POST'])
def fill_init_rounds_ex(finals_ex_id):        
    checked_player_list = [p for p in json.loads(request.data)['checked_players'] if "checked" in p and p['checked']]
    finals_ex = FinalsEx.query.filter_by(finals_ex_id=finals_ex_id).first()    
    if finals_ex.division.finals_player_selection_type == "papa":
        num_players = finals_ex.num_players
    if finals_ex.division.finals_player_selection_type == "ppo" and finals_ex.description == "A":
        num_players = finals_ex.division.finals_num_qualifiers_ppo_a
    if finals_ex.division.finals_player_selection_type == "ppo" and finals_ex.description == "B":
        num_players = finals_ex.division.finals_num_qualifiers_ppo_b
    
    num_players_per_group = finals_ex.num_players_per_group
    #if num_players_per_group == 2:
    #    create_and_fill_challonge()
    powers = get_power_of_2_and_byes(num_players)
    num_bye_players = powers[1]    
    if num_bye_players > 0:
        checked_player_groups = create_match_player_groups(checked_player_list[8:],num_players_per_group)        
    else:        
        checked_player_groups = create_match_player_groups(checked_player_list,num_players_per_group)
    round_one_matches = FinalsMatchEx.query.filter_by(finals_ex_id=finals_ex_id,round_number = 1)
    round_two_matches = FinalsMatchEx.query.filter_by(finals_ex_id=finals_ex_id,round_number = 2)

    checked_player_group_index = 0
    for match in round_one_matches:
        
        match_slots = FinalsMatchSlotEx.query.filter_by(finals_match_ex_id=match.finals_match_ex_id).all()
        match_slot_id = 0
        print "%s %s is checked_player_group_index"% (finals_ex_id,checked_player_group_index)
        checked_player_group = checked_player_groups[checked_player_group_index]
        for player_number in range(0,finals_ex.num_players_per_group):            
            checked_player = checked_player_group[player_number]
            new_finals_player_ex = FinalsPlayerEx(
                seed=checked_player['rank'],
                player_id=checked_player['player_id']
            )
            DB.session.add(new_finals_player_ex)
            DB.session.commit()            
            match_slots[match_slot_id].finals_player_ex_id = new_finals_player_ex.finals_player_ex_id            
            match_slot_id = match_slot_id + 1
            DB.session.commit()    
        checked_player_group_index = checked_player_group_index + 1
        
    if num_bye_players > 0:
        bye_player_groups = create_match_player_groups(checked_player_list[0:8],num_players_per_group/2)
        bye_player_group_index = 0
        for match in round_two_matches:        
            bye_player_group = bye_player_groups[bye_player_group_index]
            for bye_player in bye_player_group:                
                new_finals_player_ex = FinalsPlayerEx(
                    seed=bye_player['rank'],
                    player_id=bye_player['player_id']
                )
                DB.session.add(new_finals_player_ex)
                DB.session.commit()
                match.bye_players.append(new_finals_player_ex)
                DB.session.commit()
            bye_player_group_index = bye_player_group_index + 1

    return jsonify({'checked_player_groups':checked_player_groups})
    

@App.route('/finals_ex/rounds/generate/finals_ex/<finals_ex_id>', methods=['POST'])
def generate_rounds_ex(finals_ex_id):
    finals_ex = FinalsEx.query.filter_by(finals_ex_id = finals_ex_id).first()
    num_players_per_group = int(finals_ex.num_players_per_group)
    #num_players = int(finals_ex.num_players)
    if finals_ex.division.finals_player_selection_type == "ppo":
        if finals_ex.description == "A":
            num_players = int(finals_ex.division.finals_num_qualifiers_ppo_a)
        else:
            num_players = int(finals_ex.division.finals_num_qualifiers_ppo_b)
            
    if finals_ex.division.finals_player_selection_type == "papa":    
        num_players = int(finals_ex.division.finals_num_qualifiers)
    num_games_per_match = finals_ex.num_games_per_match
    powers = get_power_of_2_and_byes(num_players)
    if num_players_per_group == 4:
        powers[0] = powers[0] - 1
    num_matches = powers[2]/num_players_per_group
    round = 1
    max_round = powers[0]
    if powers[1] > 0:
        bye_matches = 1
    else:
        bye_matches = 0
    childrens_list = [None]*max_round
    while round < max_round:        
        childrens_list[round]=[]
        for match_num in range(0,num_matches):
            generate_match_ex(round,finals_ex_id,num_players_per_group,num_games_per_match)
        ###        
        if round-1 >= 1:            
            finals_matches_in_round = FinalsMatchEx.query.filter_by(round_number=round,finals_ex_id=finals_ex_id).all()        
            for match in finals_matches_in_round:
                children = childrens_list[round-1].pop()
                match.child_match_id_one=children[0].finals_match_ex_id
                if children[1] is not None:
                    match.child_match_id_two=children[1].finals_match_ex_id
                DB.session.commit()
        finals_matches_in_round = FinalsMatchEx.query.filter_by(round_number=round,finals_ex_id=finals_ex_id).all()        
        if bye_matches > 0:
            for finals_match in finals_matches_in_round:                
                childrens_list[round].append([finals_match,None])
        else:
            matches = [m for m in finals_matches_in_round]
            match_index = 0
            while match_index < len(matches):                
                childrens_list[round].append([matches[match_index],matches[match_index+1]])                
                match_index = match_index + 2                
                pass            
        ###
        if bye_matches > 0:
            bye_matches = bye_matches - 1
        else:
            num_matches = num_matches / 2
        round = round + 1
        if num_matches <= 1:
            generate_match_ex(round,finals_ex_id,num_players_per_group,num_games_per_match)                
            break
        

    finals_ex.rounds = round
    DB.session.commit()
    return jsonify({'powers':powers})

def generate_match_ex(round_number,finals_ex_id, num_players_per_group, num_games_per_match):
    new_finals_match_ex = FinalsMatchEx(
        round_number = round_number,
        finals_ex_id=finals_ex_id,
        match_state="unstarted"
        )
    DB.session.add(new_finals_match_ex)
    DB.session.commit()

    for index in range(0,num_players_per_group):
        new_finals_match_slot_ex = FinalsMatchSlotEx(        
            finals_match_ex_id=new_finals_match_ex.finals_match_ex_id            
        )
        DB.session.add(new_finals_match_slot_ex)
        DB.session.commit()
        
    for index in range(0,num_games_per_match):
        new_finals_match_result_ex = FinalsMatchResultEx(
            game_number=index,
            finals_match_ex_id=new_finals_match_ex.finals_match_ex_id            
        )
        DB.session.add(new_finals_match_result_ex)
        DB.session.commit()             
        for index in range(0,num_players_per_group):
            new_finals_match_result_scores_ex = FinalsMatchResultScoreEx(
                finals_match_result_ex_id = new_finals_match_result_ex.finals_match_result_ex_id,
                order=index
            )
            DB.session.add(new_finals_match_result_scores_ex)
            DB.session.commit()
            

def get_power_of_2_and_byes(number):
    value = 2
    power = 1
    last_good = 2
    number = int(number)
    while value < number :
        value = value * 2        
        power = power+1        
        if value <= number:
            last_good = value
    return [power,number-last_good,last_good]

