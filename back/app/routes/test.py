import json
from operator import itemgetter
from sqlalchemy import null, func, text, and_
from flask import jsonify, request, abort
from flask_login import login_required
from app import App, cache
from app.types import Score, Player, Division, Entry, User, Tournament, DivisionMachine, Machine, AuditLogEntry, Metadivision, Token
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
import challonge
import random

memoize_delay=5
top_x_herb_entries = 3
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


def get_herb_division_results_ex(division_id=None,player_id=None,division_machine_id=None):                
    if division_id:        
        division_query = Division.query.filter_by(division_id=division_id).join(Tournament).filter_by(scoring_type="herb")
    else:
        division_query = Division.query.join(Tournament).filter_by(scoring_type="herb")        
    divisions = division_query.all()
    if len(divisions) is 0:
        return None,None    
    first_query = get_first_query(divisions,
                                  division_id=division_id,                                  
                                  division_machine_id=division_machine_id)
    second_query = get_herb_second_query(first_query)
    third_query = get_herb_third_query(second_query)
    fourth_query = get_herb_fourth_query(third_query)    
    results = DB.engine.execute(fourth_query)
    scores_and_ranks = {}
    division_results = {}
    player_scores_ranks = {}
    for division in divisions:        
        division_results[division.division_id]=[]
        player_scores_ranks[division.division_id]={}    
    for result in results:        
        division_results[result.entry_division_id].append(result)
        # if result.entry_player_id not in player_scores_ranks:
        #     player_scores_ranks[result.entry_player_id]={'total_points':0,'scores_count':0,'player_id':result.entry_player_id,'scores':[]}
        # if player_scores_ranks[result.entry_player_id]['scores_count'] < top_x_herb_entries:
        #     player_scores_ranks[result.entry_player_id]['total_points']=player_scores_ranks[result.entry_player_id]['total_points']+result.filter_score            
        #     player_scores_ranks[result.entry_player_id]['scores_count'] =player_scores_ranks[result.entry_player_id]['scores_count'] + 1
        if result.entry_player_id not in player_scores_ranks[result.entry_division_id]:
            player_scores_ranks[result.entry_division_id][result.entry_player_id]={'total_points':0,'scores_count':0,'player_id':result.entry_player_id,'scores':[],'all_scores':[]}
        if len(player_scores_ranks[result.entry_division_id][result.entry_player_id]['scores']) < top_x_herb_entries:
            player_scores_ranks[result.entry_division_id][result.entry_player_id]['total_points']=player_scores_ranks[result.entry_division_id][result.entry_player_id]['total_points']+result.filter_score            
            player_scores_ranks[result.entry_division_id][result.entry_player_id]['scores'].append(result)
        player_scores_ranks[result.entry_division_id][result.entry_player_id]['all_scores'].append(result)            
    for division in divisions:                
        player_scores_ranks[division.division_id] = sorted(player_scores_ranks[division.division_id].items(), key= lambda e: e[1]['total_points'],reverse=True)
        player_scores_ranks[division.division_id] = [e[1] for e in player_scores_ranks[division.division_id]]
        ranked_list = list(Ranking(player_scores_ranks[division.division_id],key=lambda pp: pp['total_points']))
        for ranked_tuple in ranked_list:
            ranked_tuple[1]['rank']=ranked_tuple[0]
        player_scores_ranks[division.division_id] = [e[1] for e in ranked_list]
    return player_scores_ranks,division_results

        
def get_herb_fourth_query(third_query):
    fourth_query_rank = func.rank().over(order_by=desc(third_query.c.score_score),
                                         partition_by=(third_query.c.score_division_machine_id))

    return select([
        third_query,
        fourth_query_rank.label('filter_rank'),                
        func.testing_papa_scoring(func.rank().over(order_by=desc(third_query.c.score_score),
                                  partition_by=(third_query.c.score_division_machine_id))).label('filter_score')        
    ]).select_from(third_query).order_by(fourth_query_rank).alias('fourth_query')
    
def get_herb_third_query(second_query):
    return select([
        second_query
    ]).select_from(second_query).where(second_query.c.single_players_rank_on_machine == 1).alias('third_query')
    
def get_herb_second_query(first_query):
    return select([
        first_query,                
        func.rank().over(order_by=desc(first_query.c.scorepoints),
                         partition_by=(first_query.c.entry_player_id,
                                       first_query.c.score_division_machine_id)
        ).label('single_players_rank_on_machine'),                
    ]).select_from(first_query).alias('second_query')    
    

def get_first_query(divisions, division_id=None,division_machine_id=None):
    papa_divisions = ""
    if not division_id and not division_machine_id:
        papa_divisions = ",".join([str(d.division_id) for d in divisions])
    if division_id:
        papa_divisions = str(division_id)
    if division_machine_id:
        papa_divisions = str(DivisionMachine.query.filter_by(division_machine_id=division_machine_id).first().division_id)
    #where_string = "entry.voided = false and entry.division_id in (%s)" % papa_divisions
    where_string = "entry.voided = false and entry.division_id in (%s)" % papa_divisions
    if division_machine_id or division_id:
        where_string = where_string + " and entry.completed=true"
    if division_machine_id:    
        where_string = where_string + " and score.division_machine_id = %s" % division_machine_id
    papa_scoring_func = func.testing_papa_scoring(func.rank().over(order_by=desc(Score.score),
                                                                   partition_by=(Entry.division_id,
                                                                                 Score.division_machine_id))).label('scorepoints')    
    #giant_join = join(join(join(Machine,DivisionMachine),Score), join(Entry, Player))
    giant_join = join(join(join(Machine,join(join(Division,Tournament),DivisionMachine)),Score), join(Entry, Player))    
    return select([                
        Entry,
        Score,
        Player,        
        Machine,
        Tournament,
        func.rank().over(order_by=desc(Score.score),
                         partition_by=Score.division_machine_id).label('scorerank'),
        papa_scoring_func
#    ],use_labels=True).select_from(join(Score, Entry)).where(text(where_string)).order_by(desc(text("entry.division_id,score.division_machine_id,scorepoints"))).alias('first_query')
    ],use_labels=True).select_from(giant_join).where(text(where_string)).order_by(desc(text("entry.division_id,score.division_machine_id,scorepoints"))).alias('first_query')        

def get_second_query(first_query):
    second_query_sum_func = func.sum(first_query.c.scorepoints)
    second_query_rank_func = func.rank().over(order_by=desc(second_query_sum_func),partition_by=(first_query.c.entry_division_id)).label('scorepointsrank')    
    
    return select([
        first_query.c.entry_entry_id,
        first_query.c.entry_division_id,
        second_query_sum_func.label('scorepointssum'),
        second_query_rank_func,        
    ]).select_from(join(Entry,first_query,onclause=text("entry.entry_id = first_query.score_entry_id"))).group_by(text("first_query.entry_division_id,first_query.entry_entry_id")).order_by(desc(second_query_sum_func)).alias("second_query")        
    
#def get_third_query(second_query,player_id=None):
def get_third_query(first_query,second_query,player_id=None):
    if player_id:
        #query_three_where_string = "Score.entry_id = Entry.entry_id and Entry.entry_id = second_query.entry_entry_id and Entry.player_id = %s" % player_id
        query_three_where_string = "Score.entry_id = Entry.entry_id and Entry.entry_id = second_query.entry_entry_id and Entry.player_id = %s and Score.score_id=first_query.score_score_id" % player_id
    else:
        query_three_where_string = "Score.entry_id = Entry.entry_id and Entry.entry_id = second_query.entry_entry_id and Score.score_id=first_query.score_score_id"
        
    return select([                
        Score,
        Entry,
        second_query.c.scorepointssum,
        second_query.c.scorepointsrank,
#        first_query.c.scorepoints,
#        first_query.c.scorerank
        first_query,                
#    ],use_labels=True).select_from(second_query).where(text(query_three_where_string)).order_by(desc(Entry.division_id),desc(second_query.c.scorepointssum))
    ],use_labels=True).select_from(second_query).select_from(first_query).where(text(query_three_where_string)).order_by(desc(Entry.division_id),desc(second_query.c.scorepointssum))

#@cache.memoize(memoize_delay)
def get_division_machine_results_ex(division_machine_id):
    first_query = get_first_query(None,division_machine_id=division_machine_id)    
    results = DB.engine.execute(first_query)
    results_to_return=[]
    for result in results:
        results_to_return.append(result)
    return results_to_return
    

@cache.memoize(memoize_delay)
def get_division_results_ex(division_id=None,player_id=None):
    if division_id:        
        division_query = Division.query.filter_by(division_id=division_id).join(Tournament).filter_by(scoring_type="papa")
    else:
        division_query = Division.query.join(Tournament).filter_by(scoring_type="papa")        
    divisions = division_query.all()
    if len(divisions) is 0:
        return None,None,None    
    
    #divisions = Division.query.join(Tournament).filter_by(scoring_type="papa").all()    
    first_query = get_first_query(divisions, division_id=division_id)    
    second_query = get_second_query(first_query)
    #query_three = get_third_query(second_query,player_id)
    query_three = get_third_query(first_query,second_query,player_id)

    #divisions = Division.query.all()    
    sorted_list_entry_ids = {}
    division_results = {}
    in_progress_results = {}
    for division in divisions:
        sorted_list_entry_ids[division.division_id] = [] 
        division_results[division.division_id]={}
    for result in DB.engine.execute(query_three):
        if result.entry_entry_id not in division_results[result.entry_division_id]:
            division_results[result.entry_division_id][result.entry_entry_id]={'entry':result,'scores':[]}
            sorted_list_entry_ids[result.entry_division_id].append(result.entry_entry_id)            
        division_results[result.entry_division_id][result.entry_entry_id]['scores'].append(result)
        if result.entry_completed is not True:
            if result.entry_division_id not in in_progress_results:
                in_progress_results[result.entry_division_id]={'entry':result,'scores':[]}
            in_progress_results[result.entry_division_id]['scores'].append(result)
                
    #for division in divisions:        
    #    sorted_list =  sorted(division_results[division.division_id].items(), key= lambda e: e[1]['entry'].second_query_scorepointssum,reverse=True)
    #    division_results[division.division_id]=[e[1] for e in sorted_list]
    return sorted_list_entry_ids,division_results,in_progress_results

@App.route('/division_entries_ex/<division_id>', methods=['GET'])
def get_division_entries_ex(division_id):
    sorted_division_entry_ids,division_results,in_progress_results = get_division_results_ex(division_id=division_id)
    player_scores_ranks,herb_results = get_herb_division_results_ex(division_id=division_id)
    #herb_results = get_herb_players_ex(player_id)        
    return render_template('division_entries_ex.html', division_results=division_results,
                           herb_results=herb_results, division_id=int(division_id),
                           sorted_division_entry_ids=sorted_division_entry_ids, divisions=get_divisions(),
                           top_x_herb_entries=top_x_herb_entries, player_scores_ranks=player_scores_ranks)
    
@App.route('/herb_best_scores/division_id/<division_id>/player_id/<player_id>')
@fetch_entity(Division,'division')
@fetch_entity(Player, 'player')
def get_herb_best_scores_for_player_in_division(division,player):
    player_scores_ranks,herb_results = get_herb_division_results_ex(division_id=division.division_id,player_id=player.player_id)    
    scores_to_return = []
    if len(player_scores_ranks[division.division_id]) == 0:
        return jsonify({'results':None})    
    for scores in player_scores_ranks[division.division_id]:
        for score in scores['scores']:
            scores_to_return.append({'machine_name':score.machine_name,'score':score.score_score,'rank':score.filter_rank})             
    return jsonify({'results':scores_to_return})

@App.route('/division_machine_entries_ex/<division_machine_id>', methods=['GET'])
def get_division_machine_entries_ex(division_machine_id):
    division_machine = DivisionMachine.query.filter_by(division_machine_id=division_machine_id).first()
    results = get_division_machine_results_ex(division_machine_id)        
    return render_template('division_machines_scores_ex.html', machine_scores = results,
                           division_machine=division_machine, division_machines=get_machines(division_machine.division_id))     

#@cache.memoize(60)
def get_tournaments():
    #return Tournament.query.all()    
    return {t.tournament_id:t for t in Tournament.query.all()}

#@cache.memoize(60)
def get_divisions():
    #return Tournament.query.all()    
    return {d.division_id:d.to_dict_simple() for d in Division.query.all()}

def get_metadivisions():
    #return Tournament.query.all()    
    return {d.metadivision_id:d.to_dict_simple() for d in Metadivision.query.all()}

def get_machines(division_id):
    return {d.division_machine_id:d.to_dict_simple() for d in DivisionMachine.query.filter_by(division_id=division_id).all()}

def get_all_machines_dict():        
    division_machines = {}
    for d in Division.query.all():
        division_machines[d.division_id]=[]
    for dm in DivisionMachine.query.all():
        division_machines[dm.division_id].append(dm.to_dict_simple())
    return division_machines


@App.route('/player_entries_ex/<player_id>', methods=['GET'])
def get_players_entries_ex(player_id):
    player = Player.query.filter_by(player_id=player_id).first()
    
    sorted_division_entry_ids, division_results,in_progress_results = get_division_results_ex(player_id=player_id)    
    herb_player_points,herb_results = get_herb_division_results_ex(player_id=player_id)    

    query = select([                
        Token.division_id,
        func.sum(Token.token_id).label('token_total')        
    ]).select_from(Token).where(text("player_id=%s" % player_id)).group_by(Token.division_id)    
    token_counts = [t for t in DB.engine.execute(query) if t.token_total > 0 and t.division_id is not None]

    metadiv_query = select([                
        Token.metadivision_id,
        func.sum(Token.token_id).label('token_total')        
    ]).select_from(Token).where(text("player_id=%s" % player_id)).group_by(Token.metadivision_id)    
    metadiv_token_counts = [t for t in DB.engine.execute(metadiv_query) if t.token_total > 0 and t.metadivision_id is not None]
    
    #sorted_division_entry_ids = {}
    #division_results = {}
    return render_template('player_entries_ex.html', division_results=division_results,
                           herb_results=herb_results, player=player,
                           sorted_division_entry_ids=sorted_division_entry_ids, divisions=get_divisions(),
                           top_x_herb_entries=top_x_herb_entries, herb_player_points=herb_player_points,
                           in_progress_results=in_progress_results, token_counts=token_counts,
                           metadiv_token_counts=metadiv_token_counts, metadivisions=get_metadivisions())
    

@App.route('/', methods=['GET'])
def get_index_ex():
    return render_template('toc.html')

@App.route('/divisions', methods=['GET'])
def get_divisions_ex():    
    return render_template('divisions.html',divisions=get_divisions())

@App.route('/division_machines', methods=['GET'])
def get_division_machines_ex():        
    return render_template('division_machines.html',division_machines=get_all_machines_dict(),
                           divisions=get_divisions())

@App.route('/players', methods=['GET'])
def get_players_ex():
    players = Player.query.order_by(Player.first_name).all()
    return render_template('players.html',players=players)

@App.route('/audit_log/<player_id>', methods=['GET'])
@fetch_entity(Player, 'player')
def get_player_audit_log(player):
    audit_log = AuditLogEntry.query.filter_by(player_id=player.player_id).order_by(AuditLogEntry.timestamp).all()
    
    if not audit_log:
        return jsonify({})
    audit_log_entries = [a.to_dict_simple() for a in audit_log]
    
    for entry in audit_log_entries:
        if entry['division_id']:
            entry['division']=Division.query.filter_by(division_id=entry['division_id']).first().to_dict_simple()
        if entry['division_machine_id']:
            entry['division_machine']=DivisionMachine.query.filter_by(division_machine_id=entry['division_machine_id']).first().to_dict_simple()        
        if entry['entry_id']:
            entry['division']=Entry.query.filter_by(entry_id=entry['entry_id']).first().division.to_dict_simple()
        if entry['metadivision_id']:
            entry['metadivision']=Metadivision.query.filter_by(metadivision_id=entry['metadivision_id']).first().to_dict_simple()
            
        
    
    return render_template('audit_log.html',audit_log_entries=audit_log_entries)
            
