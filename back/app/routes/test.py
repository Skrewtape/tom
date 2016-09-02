import json
from sqlalchemy import null, func, text
from flask import jsonify, request, abort
from flask_login import login_required
from app import App
from app.types import Score, Player, Division, Entry, User
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity
from sqlalchemy.sql import select
from flask_restless.helpers import to_dict
from sqlalchemy.sql import functions
#from sqlalchemy import within_group
from sqlalchemy.orm import join
from sqlalchemy.sql.expression import desc

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

@App.route('/test_herb_player_rankings_for_division/<division_id>/<num_players>/<type>', methods=['GET'])
def test_get_players_ranked_by_qualifying_herb(division_id,num_players,type):
    if type == "papa":
        s = select([
            Score,
            Entry.division_id,
            Score.score_id,
            Score.entry_id,
            func.testing_papa_scoring(func.rank().over(order_by=Score.score,partition_by=Score.division_machine_id)).label('realrank')
        ]).select_from(join(Score, Entry)).where(text("entry.division_id = "+str(division_id)+" and entry.completed = true and entry.voided = false")).alias('fake')
        what = func.sum(s.c.realrank).label('suming')
        new_s = select([
            Entry.entry_id,        
            func.sum(s.c.realrank).label('suming')
        ]).select_from(join(Entry,s)).group_by(Entry.entry_id).order_by(desc(what)).limit(num_players)

        results = DB.engine.execute(new_s)
        for result in results:
            print "entry_id : %s, sum : %s "% (result.entry_id, result.suming)
        return jsonify({})
    
    # s = select([
    #     Score.score_id,
    #     func.testing_papa_scoring(func.rank().over(order_by=Score.score,partition_by=Entry.player_id)).label('realrank')                
    # ]).select_from(join(Score,Entry)).where(text("realrank = 0"))

    s = select([
        Score.score,
        Score.score_id,
        Entry.player_id,
        Score.division_machine_id,
        func.rank().over(order_by=text("score.score desc"),partition_by=(Entry.player_id,Score.division_machine_id)).label('realrank')                
    ]).select_from(join(Score,Entry)).alias('poop')

    new_s = select([
        s.c.score,
        s.c.realrank,
        s.c.score_id,
        s.c.player_id,
        s.c.division_machine_id,
    ]).select_from(s).where(s.c.realrank == 1).order_by(desc(s.c.realrank)).alias('poop2')

    really_new_s = select([
        new_s.c.score,
        new_s.c.score_id,        
        new_s.c.player_id,
        new_s.c.division_machine_id,        
        func.testing_papa_scoring(func.rank().over(text("poop2.division_machine_id order by poop2.score desc"))).label('realrank')
    ]).select_from(Score).where(text("score.score_id=poop2.score_id"))
    print really_new_s
    results = DB.engine.execute(really_new_s)
    for result in results:
        print "score id : %s, realrank :  %s, player_id :  %s, score :  %s, machine : %s"% (result.score_id, result.realrank,result.player_id, result.score, result.division_machine_id)
    # if checked_players:
    #     checked_players = " where player_id in (%s) " % checked_players
    # else:
    #     checked_players = ""
    # entry_results = DB.engine.execute("select player_id, entry_score_sum, rank() over (order by entry_score_sum desc) as rank from (select  player_id, sum(entry_score) as entry_score_sum  from (select entry.player_id,  testing_papa_scoring(rank() over (partition by division_machine_id order by score.score desc)) as entry_score from score,entry where score.entry_id = entry.entry_id and division_id = %s and completed = true and voided = false) as ss %s group by player_id order by entry_score_sum desc limit %d) as tt" % (division_id, checked_players,num_players) )
    # unranked_players = []
    # unranked_player_tracker = {}
    # #ranked_list =  list(Ranking(entry_result,key=lambda e: int(e.),reverse=True))    
    # for player_result in entry_results:
    #     #print "%s %s %s" %(player_result.player_id,player_result.entry_score_sum,player_result.entry_id) 
    #     if player_result.player_id not in unranked_player_tracker:
    #         unranked_player_tracker[player_result.player_id]=player_result
    #     else:
    #         if unranked_player_tracker[player_result.player_id].entry_score_sum <= player_result.entry_score_sum:
    #             unranked_player_tracker[player_result.player_id]=player_result
    #             #ranked_players.append(player_result)
    # for key,value in unranked_player_tracker.iteritems():
    #     unranked_players.append(value)
    # sorted_players = sorted(unranked_players, key=itemgetter('rank'))
    # ranked_players =  list(Ranking(sorted_players,key=lambda e: e.rank,reverse=True))                    
    
    # return ranked_players
    return jsonify({})
