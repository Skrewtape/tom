import json
from operator import itemgetter
from sqlalchemy import null, func, text, and_
from flask import jsonify, request, abort
from flask_login import login_required
from app import App, cache
from app.types import Score, Player, Division, Entry, User, Tournament
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity
from sqlalchemy.sql import select
from flask_restless.helpers import to_dict
from sqlalchemy.sql import functions
#from sqlalchemy import within_group
from sqlalchemy.orm import join
from sqlalchemy.sql.expression import desc
import calendar
import time
from flask import render_template
from ranking import Ranking

memoize_delay=5

@App.route('/test_results_rank/division/<division_id>', methods=['GET'])
def get_division_reuslts(division_id):
    s = select([
        Score,
        Entry.division_id,
        Score.score_id,        
        func.testing_papa_scoring(func.rank().over(order_by=Score.score,partition_by=Score.division_machine_id)).label('realrank')
    ]).select_from(join(Score, Entry)).where(Entry.division_id == division_id).alias('fake')
    new_s = select([
        Entry.entry_id,        
        func.sum(s.c.realrank).label('sum')
    ]).select_from(join(Entry,s)).group_by(Entry.entry_id)
    
    result = DB.engine.execute(new_s)
    #old_players = {s.score_id: {key:s[key] for key in s.keys()} for s in result}
    players = {s.entry_id: {key:str(s[key]) for key in s.keys()} for s in result}
    print players
    return jsonify(players)


@App.route('/test_results_rank/machine/<divisionmachine_id>', methods=['GET'])
def get_machine_reuslts(divisionmachine_id):
    s = select([
        Score,
        Entry.division_id,
        Score.score_id,
        func.rank().over(order_by=Score.score,partition_by=Score.division_machine_id).label('realrank'),        
        func.testing_papa_scoring(func.rank().over(order_by=Score.score,partition_by=Score.division_machine_id)).label('realscore')
    ]).select_from(join(Score, Entry)).where(Score.division_machine_id == divisionmachine_id).order_by(desc('realrank'))
    
    result = DB.engine.execute(s)
    old_players = {s.score_id: {key:s[key] for key in s.keys()} for s in result}    
    return jsonify(old_players)
    



@App.route('/test_entry/<player_id>/entry/all', methods=['GET'])
@fetch_entity(Player, 'player')
def get_test_all_player_entries(player):
    """Get a list of all entries for a player"""    
    entries = Entry.query.filter_by(player_id=player.player_id).all()
    #scores = Score.query.filter_by(player_id=player.player_id).all()
    entries_grouped_dict = {}    
    for entry in entries:
        if entry.division_id not in entries_grouped_dict:
            entries_grouped_dict[entry.division_id]={}
        entries_grouped_dict[entry.division_id][entry.entry_id]=entry.test_to_dict_with_scores()
    return jsonify(entries_grouped_dict)
    return jsonify({})


@App.route('/test_entries', methods=['GET'])
def get_test_entries():
    """Get a list of players"""
    entries_grouped_dict = {}
    entries = Entry.query.all()                
    for entry in entries:
        print "packing entry %s \n" % entry.entry_id
        if entry.division_id not in entries_grouped_dict:
            entries_grouped_dict[entry.division_id]={}
        entries_grouped_dict[entry.division_id][entry.entry_id]=entry.to_dict_simple()
    return jsonify(entries_grouped_dict)

    
def is_power_of_2(number):
    number = int(number)
    return number != 0 and number & (number - 1) == 0

@App.route('/test_overhead', methods=['GET'])
def test_overhead():
    divisions = Division.query.all()
    return jsonify({})


def get_papa_players_ex(division_id, player_id):
#def get_papa_players_ex(division_id):
    where_string = "entry.division_id = " +str(division_id)+ "and entry.completed = true and entry.voided = false"
    papa_scoring_func = func.testing_papa_scoring(func.rank().over(order_by=desc(Score.score),
                                                                   partition_by=Score.division_machine_id)).label('scorepoints')    
    first_query = select([                
        Entry,
        Score,
        func.rank().over(order_by=desc(Score.score),
                         partition_by=Score.division_machine_id).label('scorerank'),
        papa_scoring_func
    ],use_labels=True).select_from(join(Score, Entry)).where(text(where_string)).order_by(desc(text("scorepoints"))).alias('first_query')
        
    
    second_query_sum_func = func.sum(first_query.c.scorepoints)
    second_query_rank_func = func.rank().over(order_by=desc(second_query_sum_func)).label('scorepointsrank')    
    
    second_query = select([
        Entry.entry_id,        
        second_query_sum_func.label('scorepointssum'),
        second_query_rank_func,        
    ]).select_from(join(Entry,first_query,onclause=text("entry.entry_id = first_query.score_entry_id"))).group_by(Entry.entry_id).order_by(desc(second_query_sum_func)).alias("second_query")
    #]).select_from(join(Entry,first_query,onclause=text("entry.entry_id = first_query.score_entry_id"))).where(text("Entry.player_id = %s" % player_id)).group_by(Entry.entry_id).order_by(desc(second_query_sum_func)).alias("second_query")        
    division = Division.query.filter_by(division_id=division_id).first()    
        
    #query_three_where_string = "Score.entry_id = Entry.entry_id and Entry.entry_id = second_query.entry_id"
    query_three_where_string = "Score.entry_id = Entry.entry_id and Entry.entry_id = second_query.entry_id and Entry.player_id = %s" % player_id 
        
    query_three = select([                
        Score,
        Entry,
        second_query.c.scorepointssum,
        second_query.c.scorepointsrank        
    ],use_labels=True).select_from(second_query).where(text(query_three_where_string)).order_by(desc(Entry.division_id),desc(second_query.c.scorepointssum))
    
    results = []
    for result in DB.engine.execute(query_three):
    #for result in DB.engine.execute(second_query):            
        results.append(result)            
    return results

def get_papa_players(division_id,player_id):    
    local_entries = {}    
            
    for result in get_papa_players_ex(division_id, player_id):
    #for result in get_papa_players_ex(division_id):    
        if result.entry_entry_id not in local_entries and result.entry_player_id == int(player_id):
        #if result.entry_id not in local_entries:
            local_entries[result.entry_entry_id]={'entry':None,'scores':[]}            
            local_entries[result.entry_entry_id]['entry']=result
            #local_entries[result.entry_id]={'entry':None,'scores':[]}            
            #local_entries[result.entry_id]['entry']=result    
            
        #local_entries[result.entry_entry_id]['scores'].append(result)
    ##for result in DB.engine.execute(first_query_a):        
    ##    local_entries[result.entry_entry_id]['scores'].append(result)
    scores = {}
    scores = get_papa_scores_ex(division_id, player_id)
    #scores = get_papa_scores_ex(division_id)
    for score_id,score in scores.items():
        if score.entry_player_id == int(player_id):
            local_entries[score.entry_entry_id]['scores'].append(score)
    local_entries_list = [v for k,v in local_entries.items() ]
    return local_entries_list


def get_papa_scores_ex(division_id, player_id):
#def get_papa_scores_ex(division_id):
    where_string = "entry.division_id = " +str(division_id)+ "and entry.completed = true and entry.voided = false"

    papa_scoring_func = func.testing_papa_scoring(func.rank().over(order_by=desc(Score.score),
                                                                   partition_by=Score.division_machine_id)).label('scorepoints')    
    first_query = select([                
        Entry,
        Score,
        func.rank().over(order_by=desc(Score.score),
                         partition_by=Score.division_machine_id).label('scorerank'),
        papa_scoring_func
    ],use_labels=True).select_from(join(Score, Entry)).where(text(where_string)).order_by(desc(text("scorepoints"))).alias('first_query')
        

    first_query_a = select([
        first_query
    ]).select_from(first_query).where(text("entry_player_id=%s" % player_id)).alias('first_query_a')

    scores = {}            
    for result in DB.engine.execute(first_query_a):                
        scores[result.score_score_id]=result        
    return scores


def get_papa_scores(division_id):
    where_string = "entry.division_id = " +str(division_id)+ "and entry.completed = true and entry.voided = false"

    papa_scoring_func = func.testing_papa_scoring(func.rank().over(order_by=desc(Score.score),
                                                                   partition_by=Score.division_machine_id)).label('scorepoints')    
    first_query = select([                
        Entry,
        Score,
        papa_scoring_func
    ],use_labels=True).select_from(join(Score, Entry)).where(text(where_string)).order_by(desc(text("scorepoints"))).alias('first_query')
 
    second_query_sum_func = func.sum(first_query.c.scorepoints).label('scorepointssum')
    second_query_rank_func = func.rank().over(order_by=desc(second_query_sum_func)).label('ranking')    
    
    second_query = select([
        Entry.entry_id,        
        second_query_sum_func,
        second_query_rank_func
    ]).select_from(join(Entry,first_query,onclause=text("entry.entry_id = first_query.score_entry_id"))).group_by(Entry.entry_id).order_by(desc(second_query_sum_func)).alias("second_query")
      
    rank_results = DB.engine.execute(second_query)
    score_results = DB.engine.execute(first_query)
    
    scores={}
    ranks={}
    for result in rank_results:        
        ranks[result.entry_id]=result            
    for result in score_results:        
        scores[result.score_score_id]=result                
    return scores,ranks


def get_herb_players(player_id, division_id):
    first_query_rank_func = func.rank().over(order_by=text("score.score desc"),
                                             partition_by=(Score.division_machine_id))
    first_query_points_func = func.testing_papa_scoring(first_query_rank_func)    
    first_query = select([
        Score,            
        Entry,        
        first_query_points_func.label('single_players_score_on_machine')
    ],use_labels=True).select_from(join(Score,Entry)).where(Entry.division_id == division_id).alias('first_query')    

    second_query = select([
        first_query,                
        func.rank().over(order_by=desc(first_query.c.single_players_score_on_machine),
                         partition_by=(first_query.c.entry_player_id,
                                       first_query.c.score_division_machine_id)
        ).label('single_players_rank_on_machine'),                
    ]).select_from(first_query).alias('second_query')    
    
    third_query = select([
        second_query
    ]).select_from(second_query).where(second_query.c.single_players_rank_on_machine == 1).alias('third_query')
        
    third_query_a = select([
        third_query,
        func.rank().over(order_by=desc(third_query.c.score_score),
                                                   partition_by=(third_query.c.score_division_machine_id)).label('filter_rank'),                
        func.testing_papa_scoring(func.rank().over(order_by=desc(third_query.c.score_score),
                                  partition_by=(third_query.c.score_division_machine_id))).label('filter_score')        
    ]).select_from(third_query).order_by(text("third_query.score_score desc")).alias('third_query_a')

    results = DB.engine.execute(third_query_a)
    scores_and_ranks = {}
    for result in results:
        if result.entry_player_id not in scores_and_ranks:
            scores_and_ranks[result.entry_player_id]={'entry':{'total_points':0,'player_id':result.entry_player_id},'scores':[]}
        if len(scores_and_ranks[result.entry_player_id]['scores']) < 3:
            scores_and_ranks[result.entry_player_id]['entry']['total_points']=scores_and_ranks[result.entry_player_id]['entry']['total_points']+result.filter_score
            scores_and_ranks[result.entry_player_id]['scores'].append(result)
    sorted_list =  sorted(scores_and_ranks.items(), key= lambda e: e[1]['entry']['total_points'])
    sorted_list = [e[1] for e in sorted_list]    
    ranked_list =  list(Ranking(sorted_list,key=lambda pp: pp['entry']['total_points'],reverse=True))
    ranked_list = [e for e in ranked_list if e[1]['entry']['player_id'] == int(player_id)]
    return ranked_list
    #return []

    
    
@App.route('/player_entries/<player_id>', methods=['GET'])
def get_players_entries(player_id):
    divisions = Division.query.join(Tournament).filter_by(active=True).all()
    num_players = 150
    entries = {}
    herb_entries = {}
    ranks_results = {}    
    for division in divisions:        
        division_id = division.division_id
        division_type = division.tournament.scoring_type        
        if division_type == "papa":
            entries[division.division_id]=[]
        else:
            herb_entries[division.division_id] = []                            
        
        if division_type == "herb":            
            herb_entries[division_id] = herb_entries[division_id] + get_herb_players(player_id,division_id)        
            pass
        if division_type == "papa":            
            entries[division_id] = entries[division_id] + get_papa_players(division_id, player_id)             
            #pass
            #scores_results,local_ranks_results = get_papa_scores(division_id)
            #ranks_results.update(local_ranks_results)
            #for score_id,score in scores_results.iteritems():
            #    if score.score_entry_id in local_entries[division_id]:
            #        local_entries[division_id][score.score_entry_id]['scores'].append(score)
            #entries.update(local_entries)            
    
    return render_template('test_rendering.html', entries=entries, herb_entries=herb_entries, player_id=int(player_id))


def get_herb_players_ex(player_id):
    divisions = Division.query.join(Tournament).filter_by(scoring_type="herb").all()
    herb_divisions = ",".join([str(d.division_id) for d in divisions])
    first_query_rank_func = func.rank().over(order_by=text("score.score desc"),
                                             partition_by=(Entry.division_id,Score.division_machine_id))
    first_query_points_func = func.testing_papa_scoring(first_query_rank_func)    
    first_query = select([
        Score,            
        Entry,        
        first_query_rank_func.label('scorerank'),
        first_query_points_func.label('scorepoints')
    ],use_labels=True).select_from(join(Score,Entry)).where(text("entry.division_id in (%s)" % herb_divisions)).alias('first_query')    

    second_query = select([
        first_query,                
        func.rank().over(order_by=desc(first_query.c.scorepoints),
                         partition_by=(first_query.c.entry_player_id,
                                       first_query.c.score_division_machine_id)
        ).label('single_players_rank_on_machine'),                
    ]).select_from(first_query).alias('second_query')    
    
    third_query = select([
        second_query
    ]).select_from(second_query).where(second_query.c.single_players_rank_on_machine == 1).alias('third_query')
        
    third_query_a = select([
        third_query,
        func.rank().over(order_by=desc(third_query.c.score_score),
                         partition_by=(third_query.c.score_division_machine_id)).label('filter_rank'),                
        func.testing_papa_scoring(func.rank().over(order_by=desc(third_query.c.score_score),
                                  partition_by=(third_query.c.score_division_machine_id))).label('filter_score')        
    ]).select_from(third_query).order_by(text("third_query.score_score desc")).alias('third_query_a')

    results = DB.engine.execute(third_query_a)
    scores_and_ranks = {}
    for result in results:
        if result.entry_player_id not in scores_and_ranks:
            scores_and_ranks[result.entry_player_id]={'entry':{'total_points':0,'player_id':result.entry_player_id},'scores':[],'all_scores':[]}
        if len(scores_and_ranks[result.entry_player_id]['scores']) < 3:
            scores_and_ranks[result.entry_player_id]['entry']['total_points']=scores_and_ranks[result.entry_player_id]['entry']['total_points']+result.filter_score
            scores_and_ranks[result.entry_player_id]['scores'].append(result)
        scores_and_ranks[result.entry_player_id]['all_scores'].append(result)
    # sorted_list =  sorted(scores_and_ranks.items(), key= lambda e: e[1]['entry']['total_points'])
    # sorted_list = [e[1] for e in sorted_list]    
    # ranked_list =  list(Ranking(sorted_list,key=lambda pp: pp['entry']['total_points'],reverse=True))
    # ranked_list = [e for e in ranked_list if e[1]['entry']['player_id'] == int(player_id)]
    return scores_and_ranks
    #return []

    
@App.route('/player_entries_ex/<player_id>', methods=['GET'])
def get_players_entries_ex(player_id):
    divisions = Division.query.join(Tournament).filter_by(scoring_type="papa").all()
    papa_divisions = ",".join([str(d.division_id) for d in divisions])

    where_string = "entry.completed = true and entry.voided = false and entry.division_id in (%s)" % papa_divisions
    papa_scoring_func = func.testing_papa_scoring(func.rank().over(order_by=desc(Score.score),
                                                                   partition_by=(Entry.division_id,Score.division_machine_id))).label('scorepoints')    
    first_query = select([                
        Entry,
        Score,
        func.rank().over(order_by=desc(Score.score),
                         partition_by=Score.division_machine_id).label('scorerank'),
        papa_scoring_func
    ],use_labels=True).select_from(join(Score, Entry)).where(text(where_string)).order_by(desc(text("entry.division_id,score.division_machine_id,scorepoints"))).alias('first_query')
        
    
    second_query_sum_func = func.sum(first_query.c.scorepoints)
    second_query_rank_func = func.rank().over(order_by=desc(second_query_sum_func),partition_by=(first_query.c.entry_division_id)).label('scorepointsrank')    
    
    second_query = select([
        first_query.c.entry_entry_id,
        first_query.c.entry_division_id,
        second_query_sum_func.label('scorepointssum'),
        second_query_rank_func,        
    ]).select_from(join(Entry,first_query,onclause=text("entry.entry_id = first_query.score_entry_id"))).group_by(text("first_query.entry_division_id,first_query.entry_entry_id")).order_by(desc(second_query_sum_func)).alias("second_query")        
        
    query_three_where_string = "Score.entry_id = Entry.entry_id and Entry.entry_id = second_query.entry_entry_id and Entry.player_id = %s" % player_id 
        
    query_three = select([                
        Score,
        Entry,
        second_query.c.scorepointssum,
        second_query.c.scorepointsrank        
    ],use_labels=True).select_from(second_query).where(text(query_three_where_string)).order_by(desc(Entry.division_id),desc(second_query.c.scorepointssum))
    #divisions = Division.query.all()    
    division_results = {}
    for division in divisions:
        division_results[division.division_id]={}
    for result in DB.engine.execute(query_three):
        if result.entry_entry_id not in division_results[result.entry_division_id]:
            division_results[result.entry_division_id][result.entry_entry_id]={'entry':result,'scores':[]}
        division_results[result.entry_division_id][result.entry_entry_id]['scores'].append(result)        
    for division in divisions:
        sorted_list =  sorted(division_results[division.division_id].items(), key= lambda e: e[1]['entry'].second_query_scorepointssum,reverse=True)
        division_results[division.division_id]=[e[1] for e in sorted_list]
    herb_results = get_herb_players_ex(player_id)        
    return render_template('test_rendering_ex.html', return_results=division_results, herb_results=herb_results, player_id=int(player_id))
    

