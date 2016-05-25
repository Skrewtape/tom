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

@App.route('/results/player/<player_id>', methods=['GET'])
def results_player(player_id):
    divisions = Division.query.all()
    return_entry_results = {}
    return_score_results = {}
    return_inprogress_entry_results = {}
    
    for division in divisions:
        division_id = division.division_id
        #return_entry_results[division_id]=[]
        #return_inprogress_entry_results[division_id]=[]
        entry_results = DB.engine.execute("select entry_id, player_id, entry_score_sum, rank() over (order by entry_score_sum desc), voided, completed from (select voided, completed, entry_id, player_id, sum(entry_score) as entry_score_sum  from (select entry.voided, entry.completed, entry.player_id, score.entry_id, testing_papa_scoring(rank() over (partition by division_machine_id order by score.score desc)) as entry_score from score,entry where score.entry_id = entry.entry_id and division_id = %s) as ss group by ss.entry_id, player_id,voided,completed order by entry_score_sum desc) as tt" % division_id )    
        score_results = DB.engine.execute("select machine.name, score.score, score.entry_id, rank() over (partition by score.division_machine_id order by score.score desc) as rank, testing_papa_scoring(rank() over (partition by score.division_machine_id order by score.score desc)) as entry_score from score,entry,division_machine,machine where score.division_machine_id = division_machine.division_machine_id and division_machine.machine_id = machine.machine_id and score.entry_id = entry.entry_id and entry.division_id = %s order by entry_score desc" % division_id)
        for score in score_results:
            if not score[2] in return_score_results:
                return_score_results[score[2]] = []
            return_score_results[score[2]].append({'machine_name':score[0], 'machine_rank':score[3], 'machine_score':score[1], 'machine_points':score[4]})

        for result in entry_results:
            if result[1] != int(player_id):
                continue            
            if result[5] == False and result[4] == False :
                if division_id not in return_inprogress_entry_results:
                    return_inprogress_entry_results[division_id]=[]
                return_inprogress_entry_results[division_id].append({'rank':result[3],'entry_id':result[0],'player_id':result[1],'total_score':result[2], 'completed':result[5],'voided':result[4],'scores':return_score_results[result[0]]})
                continue
            if division_id not in return_entry_results:
                return_entry_results[division_id]=[]            
            return_entry_results[division_id].append({'rank':result[3],'entry_id':result[0],'player_id':result[1],'total_score':result[2], 'completed':result[5],'voided':result[4],'scores':return_score_results[result[0]]})
    tokens = Token.query.filter_by(player_id=player_id).all()
    player = Player.query.filter_by(player_id=player_id).first()
    tournaments = Tournament.query.all()
    division_machines = DivisionMachine.query.all()
    division_machine_results = {}
    division_results = {}
    tournament_results = {}
    token_results = {}
    token_metadivision_results = {}
    player_results = player.to_dict_with_team()
    metadivisions_results = {}
    metadivisions = Metadivision.query.all()
    for metadiv in metadivisions:
        metadivisions_results[metadiv.metadivision_id]=metadiv.to_dict_simple()
        
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

    for token in tokens:
        #FIXME : need to handle metadivs
        #FIXME : need to handle teams
        if token.division_id is not None:
            if token.division_id not in token_results:
                token_results[token.division_id] = 0            
            token_results[token.division_id]=token_results[token.division_id]+1
        if token.metadivision_id is not None:            
            if token.metadivision_id not in token_metadivision_results:
                token_metadivision_results[token.metadivision_id] = 0            
            token_metadivision_results[token.metadivision_id]=token_metadivision_results[token.metadivision_id]+1
        
    for division_machine in division_machines:
        division_machine_results[division_machine.division_id].append(division_machine.to_dict_simple())

    return render_template('player_results.html', player_entries=return_entry_results,
                           player=player_results,division_tokens=token_results,
                           tournaments=tournament_results,inprogress_entries=return_inprogress_entry_results,
                           divisions=division_results, division_machines=division_machine_results,
                           metadivision_tokens=token_metadivision_results, metadivisions=metadivisions_results)

@App.route('/results/players', methods=['GET'])
def results_players():
    players = Player.query.all()
    divisions = Division.query.all()
    tournaments = Tournament.query.all()
    division_machines = DivisionMachine.query.all()
    player_results = []
    division_machine_results = {}
    division_results = {}
    tournament_results = {}
    return_entry_results = []
    return_score_results = []

    for player in players:
        player_results.append(player.to_dict_simple())

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

    # for division in divisions:
    #     tournament = tournament_results[division.tournament_id]
    #     if tournament['single_division'] is True:
    #         division.name=tournament['name']
    #     else:
    #         division.name="%s %s" % (tournament['name'], division.name)            
    #     division_results[division.division_id]=to_dict(division)
    #     division_machine_results[division.division_id] = []
        
    for division_machine in division_machines:
        division_machine_results[division_machine.division_id].append(division_machine.to_dict_simple())

    return render_template('players_results.html', 
                           players=player_results,division=division,
                           tournament=tournament,tournaments=tournament_results,
                           divisions=division_results, division_machines=division_machine_results)

                           
@App.route('/results/division_machine/<division_machine_id>', methods=['GET'])
def results_division_machine(division_machine_id):
    score_results = DB.engine.execute("select machine.name, score.score, score.entry_id, rank() over (partition by score.division_machine_id order by score.score desc) as rank, testing_papa_scoring(rank() over (partition by score.division_machine_id order by score.score desc)) as entry_score, entry.player_id from score,entry,division_machine,machine where score.division_machine_id = division_machine.division_machine_id and division_machine.machine_id = machine.machine_id and score.entry_id = entry.entry_id and score.division_machine_id = %s and entry.completed = true and entry.voided = false order by entry_score desc" % division_machine_id)

    players = Player.query.all()
    divisions = Division.query.all()
    tournaments = Tournament.query.all()
    division_machines = DivisionMachine.query.all()
    player_results = {}
    division_machine_results = {}
    division_results = {}
    tournament_results = {}
    return_entry_results = []
    return_score_results = []

    for player in players:
        player_results[player.player_id]=to_dict(player)

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

        # for division in divisions:
        # tournament = tournament_results[division.tournament_id]
        # if tournament['single_division'] is True:
        #     division.name=tournament['name']
        # else:
        #     division.name="%s %s" % (tournament['name'], division.name)            
        # division_results[division.division_id]=to_dict(division)
        # division_machine_results[division.division_id] = []
        
    for division_machine in division_machines:
        if division_machine.division_machine_id == int(division_machine_id):
            return_division_machine=division_machine.to_dict_simple()
        division_machine_results[division_machine.division_id].append(division_machine.to_dict_simple())

    for score in score_results:
        return_score_results.append({'rank':score[3],'score':score[1],'player_id':score[5],'points':score[4],'entry_id':score[2]})
        

    return render_template('machine_results.html', machine_scores=return_score_results,
                           players=player_results,division=division,
                           tournament=tournament,tournaments=tournament_results,
                           divisions=division_results, division_machines=division_machine_results,
                           division_machine=return_division_machine)
        


@App.route('/results/division/<division_id>', methods=['GET'])
def results_divisions(division_id=None):    
    
    entry_results = DB.engine.execute("select entry_id, player_id, entry_score_sum, rank() over (order by entry_score_sum desc) from (select entry_id, player_id, sum(entry_score) as entry_score_sum  from (select entry.player_id, score.entry_id, testing_papa_scoring(rank() over (partition by division_machine_id order by score.score desc)) as entry_score from score,entry where score.entry_id = entry.entry_id and division_id = %s and completed = true and voided = false) as ss group by ss.entry_id, player_id order by entry_score_sum desc limit 200) as tt" % division_id )
    
    score_results = DB.engine.execute("select machine.name, score.score, score.entry_id, rank() over (partition by score.division_machine_id order by score.score desc) as rank, testing_papa_scoring(rank() over (partition by score.division_machine_id order by score.score desc)) as entry_score from score,entry,division_machine,machine where score.division_machine_id = division_machine.division_machine_id and division_machine.machine_id = machine.machine_id and score.entry_id = entry.entry_id and entry.division_id = %s order by entry_score desc" % division_id)

    players = Player.query.all()
    divisions = Division.query.all()
    tournaments = Tournament.query.all()
    division_machines = DivisionMachine.query.all()
    player_results = {}
    division_machine_results = {}
    division_results = {}
    tournament_results = {}
    return_entry_results = []
    return_score_results = {}

    for player in players:
        player_results[player.player_id]=to_dict(player)

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

    # for division in divisions:
    #     tournament = tournament_results[division.tournament_id]
    #     if tournament['single_division'] is True:
    #         division.name=tournament['name']
    #     else:
    #         division.name="%s %s" % (tournament['name'], division.name)            
    #     division_results[division.division_id]=to_dict(division)
    #     division_machine_results[division.division_id] = []
        
    for division_machine in division_machines:
        division_machine_results[division_machine.division_id].append(division_machine.to_dict_simple())

    for score in score_results:
        if not score[2] in return_score_results:
            return_score_results[score[2]] = []
        return_score_results[score[2]].append({'machine_name':score[0], 'machine_rank':score[3]})

    for result in entry_results:
        return_entry_results.append({'rank':result[3],'entry_id':result[0],'player_id':result[1],'total_score':result[2], 'scores':return_score_results[result[0]]})

    division = division_results[int(division_id)]
    tournament = tournament_results[division_results[int(division_id)]['tournament_id']]

    return render_template('division_results.html', division_entrys=return_entry_results,
                           players=player_results,division=division,
                           tournament=tournament,tournaments=tournament_results,
                           divisions=division_results, division_machines=division_machine_results)



    
