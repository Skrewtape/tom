import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Entry, Score, Player, Division, Machine, DivisionMachine, Token
from app import App, Admin_permission, Scorekeeper_permission, Void_permission, DB
from app.routes.util import fetch_entity, calculate_score_points_from_rank, get_division_from_metadivision
from app.routes import team
from app import tom_config
from werkzeug.exceptions import Conflict, BadRequest

def shared_get_query_for_active_entries(player_id=None,team_id=None,div_id=None,metadiv_id=None):
    if metadiv_id is None and div_id is None:
        raise Exception('no metadiv_id or div_id specified')
    if team_id is None and player_id is None:
        raise Exception('no team_id and player_id specified')    
    if metadiv_id:
        # WE ASSUME ONLY ONE DIVISION IN A METADIVISION IS ACTIVE AT ONCE
        division = get_division_from_metadivision(metadiv_id)
    if div_id:
        division = Division.query.filter_by(division_id=div_id).first()            
    if player_id:
        query = Entry.query.filter_by(division_id=division.division_id,player_id=player_id,active=True)
    if team_id:
        query = Entry.query.filter_by(division_id=division.division_id,team_id=team_id,active=True)        
    return query

def shared_check_player_can_start_new_entry(player,division):    
    #FIXME : this needs cleaned up
    teams = team.shared_get_player_teams(player.player_id)
    if len(teams) > 0:
        #FIXME : will eventually need to deal with multiple teams
        team_id = teams[0].team_id
    else:
        team_id = None

    active_entries = []
    if division.tournament.team_tournament and team_id is not None:
        active_entries = shared_get_query_for_active_entries(team_id=team_id,div_id=division.division_id).all()            
    if division.tournament.team_tournament == False:
        active_entries = shared_get_query_for_active_entries(player_id=player.player_id,div_id=division.division_id).all()            
    if len(active_entries) != 0:
        return False
    if division.metadivision_id:
        available_tokens = Token.query.filter_by(player_id=player.player_id,metadivision_id=division.metadivision_id).all()
    else:
        if division.tournament.team_tournament:
            available_tokens = Token.query.filter_by(team_id=team_id,division_id=division.division_id).all()
        else:
            available_tokens = Token.query.filter_by(player_id=player.player_id,division_id=division.division_id).all()
    if len(available_tokens) == 0:
        return False
    return True

def shared_create_active_entry(player,division):
    # if division tournament is team, lookup team_id for player
    if not division.tournament.active:
        raise Conflict('tournament closed')

    teams = team.shared_get_player_teams(player.player_id)
    if len(teams) > 0:
        #FIXME : will eventually need to deal with multiple teams
        team_id = teams[0].team_id
    else:
        team_id = None    
    
    if division.metadivision_id:        
        token_query = Token.query.filter_by(player_id=player.player_id,metadivision_id=division.metadivision_id)               
    else:
        if division.tournament.team_tournament is False:        
            token_query = Token.query.filter_by(player_id=player.player_id,division_id=division.division_id)
        else:
            token_query = Token.query.filter_by(team_id=team_id,division_id=division.division_id)            
    if len(token_query.all()) == 0:
        raise Conflict('No tokens are available')        

    active_entries = []
    if division.tournament.team_tournament and team_id is not None:
        active_entries = shared_get_query_for_active_entries(team_id=team_id,div_id=division.division_id).all()
    if division.tournament.team_tournament is False:
        active_entries = shared_get_query_for_active_entries(player_id=player.player_id,div_id=division.division_id).all()        
    if len(active_entries) != 0:
        raise Conflict('Active entry already exists')
    new_entry = Entry(
            division = division,
            active = True,
            completed = False,
            refresh = False,
            voided = False,
            number_of_scores_per_entry = division.number_of_scores_per_entry
        )
    if division.tournament.team_tournament:
        new_entry.team_id = team_id            
    else:            
        new_entry.player_id = player.player_id
    DB.session.add(new_entry)
    
    token_id = token_query.first().token_id
    Token.query.filter_by(token_id=token_id).delete()
    DB.session.commit()


@App.route('/new_entry/division/<division_id>/player/<player_id>', methods=['GET'])
@fetch_entity(Division, 'division')
@fetch_entity(Player, 'player')
def check_player_can_start_new_entry(player,division):
    return jsonify({'player_can_start_new_entry':shared_check_player_can_start_new_entry(player,division)})

@App.route('/new_entry/division/<division_id>/player/<player_id>', methods=['POST'])
@fetch_entity(Division, 'division')
@fetch_entity(Player, 'player')
def create_new_entry(player,division):
    if shared_check_player_can_start_new_entry(player,division):
        shared_create_active_entry(player,division)
    else:
        raise Conflict('You done fucked up')                
    return jsonify({})


@App.route('/entry/<entry_id>/void', methods=['PUT'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Entry, 'entry')
def void_entry(entry):
    """set a entry to voided, and tries to start a new entry if available"""
    entry.voided = True
    entry.active = False
    player = Player.query.filter_by(player_id=entry.player_id).first()
    division_machine = player.division_machine
    if division_machine:
        division_machine.player_id = None
        division_machine.team_id = None
    division = Division.query.filter_by(division_id=entry.division_id).first()
    DB.session.commit()
    if shared_check_player_can_start_new_entry(player,division) is False:
        return jsonify(entry.to_dict_simple())        
    shared_create_active_entry(player,division)
    return jsonify(entry.to_dict_simple())


@App.route('/entry/<entry_id>/void/<voided_state>', methods=['PUT'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Entry, 'entry')
def toggle_entry_voided(entry,voided_state):
    """set a entry voided state, and DOES NOT try and start a new entry"""
    #FIXME : this should have better checks
    entry.voided = True if voided_state=="void" else False

    if division_machine and entry.active and entry.voided:
        player = Player.query.filter_by(player_id=entry.player_id).first()
        division_machine = player.division_machine
        division_machine.player_id = None

    entry.active = False if entry.voided else True
    DB.session.commit()
    return jsonify(entry.to_dict_simple())

@App.route('/score/<score_id>', methods=['DELETE'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Score, 'score')
def remove_score(score):
    """remove a score"""   
    old_entry = Entry.query.filter_by(entry_id=score.entry_id).first()            
    old_entry.scores.remove(score)
    DB.session.commit()
    return jsonify(score.to_dict_simple())

@App.route('/score/<score_id>', methods=['PUT'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Score, 'score')
def edit_score(score):
    """change a score"""   
    score_data = json.loads(request.data)
    #FIXME : oops - will probably need to change the frontend to machine the division_machine_id key
    if 'division_machine_id' in score_data:
        score.division_machine_id = score_data['division_machine_id']
    if 'score' in score_data:
        score.score = score_data['score']         
    DB.session.commit()
    return jsonify(score.to_dict_simple())

def add_score(entry,division_machine,new_score_value):
    if len(entry.scores) >= entry.number_of_scores_per_entry:
        raise Conflict('Entry already has enough scores')
    if any(score.division_machine_id ==  division_machine.division_machine_id for score in entry.scores):
        raise Conflict('Can not play the same game twice in one ticket')
    if entry.player and entry.player.active is False:
        raise Conflict('Player is no longer active.  Please see the front desk')        
    division = Division.query.filter_by(division_id=entry.division_id).first()    
    if division_machine not in division.machines:
        raise Conflict('machine is not in division')            
    new_score = Score(
        score = new_score_value,
        division_machine_id = division_machine.division_machine_id
    )
    entry.scores.append(new_score)
    division_machine.player_id = None
    division_machine.team_id = None
    if len(entry.scores) >= entry.number_of_scores_per_entry:
        entry.active=False
    DB.session.commit()
    return jsonify(entry.to_dict_with_scores())


@App.route('/entry/<entry_id>/divisionmachine/<divisionmachine_id>/new_score/<new_score_value>', methods=['POST'])
@login_required
@fetch_entity(Entry, 'entry')
@fetch_entity(DivisionMachine, 'divisionmachine')
def add_score_with_decorator(entry,divisionmachine,new_score_value):
    return add_score(entry,divisionmachine,new_score_value)

@App.route('/entry/<entry_id>', methods=['GET'])
@fetch_entity(Entry, 'entry')
def get_entry(entry):
    """Return specific entry"""    
    return jsonify(entry.to_dict_with_scores())

def complete_entry(entry):
    """Complete specific entry"""    
    if entry.completed == True or entry.voided == True or entry.active == True:
        raise Conflict('entry is already completed or voided or inactive')
    entry.completed = True
    DB.session.commit()
    return jsonify(entry.to_dict_with_scores())


@App.route('/entry/<entry_id>/complete', methods=['PUT'])
@login_required
@fetch_entity(Entry, 'entry')
def complete_entry_with_decorator(entry):
    """Complete specific entry"""    
    return complete_entry(entry)
    # if entry.completed == True or entry.voided == True or entry.active == False:
    #     raise Conflict('entry is already completed or voided')
    # entry.completed = True
    # entry.active = False
    # DB.session.commit()
    # entries = Entry.query.filter_by(player_id=entry.player_id,completed=False,voided=False,division_id=entry.division_id).all()        
    # if entries:
    #     entries[0].active = True
    # DB.session.commit()
    #return jsonify(entry.to_dict_with_scores())

@App.route('/entry/<entry_id>/estimate_score_ranks', methods=['GET'])
@fetch_entity(Entry, 'entry')
def estimate_entry_score_ranks(entry):
    """Estimate the rank of scores in a entry still in progress"""
    if entry.completed == True or entry.voided == True or entry.active == False:
        raise Conflict('entry is already completed or voided')
    score_dicts = {}
    for score in entry.scores:
        cur_score_dict = score.to_dict_simple()
        lower_score = Score.query.filter(Score.division_machine_id == score.division_machine_id, Score.rank != None, Score.score < score.score).order_by(Score.score.desc()).first()        
        higher_score = Score.query.filter(Score.division_machine_id == score.division_machine_id, Score.rank != None, Score.score > score.score).order_by(Score.score.asc()).first()        
        lower_score_dict = {}
        if lower_score:
            cur_score_dict['estimated_rank'] = lower_score.rank
            cur_score_dict['estimated_points'] = calculate_score_points_from_rank(lower_score.rank)
        else:
            if higher_score:
                cur_score_dict['estimated_rank'] = higher_score.rank+1
                cur_score_dict['estimated_points'] = calculate_score_points_from_rank(higher_score.rank+1)                
            else:
                cur_score_dict['estimated_rank'] = 1
                cur_score_dict['estimated_points'] = calculate_score_points_from_rank(1)                                
        score_dicts[score.score_id] = cur_score_dict
    return jsonify(score_dicts)


@App.route('/entry/divisionMachineId/<divisionmachine_id>', methods=['GET'])
def get_entries_for_machine(divisionmachine_id):
    entries = Entry.query.filter_by(completed=True,voided=False).join(Score).filter_by(division_machine_id=divisionmachine_id).all()            
    entries_dict={} 
    for entry in entries:
        entries_dict[entry.entry_id]=entry.to_dict_simple()
    return jsonify(entries_dict)


@App.route('/entry/player/<player_id>', methods=['POST'])
@login_required
@fetch_entity(Player, 'player')
def add_multiple_entries(player):
    """Create new entries in bulk"""    
    if player.active is False:
        raise Conflict('Player is no longer active.  Please see the front desk')        
    entries_data = json.loads(request.data)    
    for division_id,count in entries_data.items():
        add_entries_for_division(count,division_id,player.player_id)
    return jsonify({})

def add_entries_for_division(num_entries,division_id,player_id):
    num_entries = int(num_entries)    
    player = Player.query.filter_by(player_id=player_id).first()
    if player is None:
        raise Conflict('Player Id %s does not exist!' % player_id )        
    division = Division.query.filter_by(division_id=division_id).first()    
    if division is None:
        raise Conflict('Division Id %s does not exist!' % division_id )        
    if num_entries > tom_config.scores_per_entry:
        raise Conflict('too many entries requested')
    if not division.tournament.active:
        raise Conflict('tournament closed')
    existing_entries = Entry.query.filter_by(player_id=player_id,division_id=division_id,completed=False,voided=False).count()
    if existing_entries + num_entries > tom_config.max_num_concurrent_entries:
        raise Conflict('already at max number of entries for user')
    for entry_num in range(0, num_entries):
        new_entry = Entry(
            division = division,
            active = True,
            completed = False,
            refresh = False,
            voided = False,
            #FIXME : this should be configurable per tournament
            number_of_scores_per_entry = tom_config.scores_per_entry
        )

        if( existing_entries >= 1 or entry_num > 0):
            new_entry.active=False    
        DB.session.add(new_entry)
        player.entries.append(new_entry)
        DB.session.commit()


@App.route('/player/<player_id>/entry/division/<division_id>/numEntrys/<num_entrys>', methods=['POST'])
@login_required
@fetch_entity(Player, 'player')
@fetch_entity(Division, 'division')
def add_entry(player,division,num_entrys):
    """Create a new entry"""    
    num_entrys = int(num_entrys)
    if num_entrys > tom_config.scores_per_entry:
        raise Conflict('too many entries requested')
    #entry_data = json.loads(request.data)    
    #division = Division.query.get(entry_data['division_id'])
    if not division.tournament.active:
        raise Conflict('tournament closed')
    existing_entries = Entry.query.filter_by(player_id=player.player_id,division_id=division.division_id,completed=False,voided=False).count()    
    print "adding entry and existing entries are %s" % existing_entries
    if existing_entries + num_entrys > tom_config.max_num_concurrent_entries:
        raise Conflict('already at max number of entries for user')
    for entry_num in range(0, num_entrys):
        new_entry = Entry(
            division = division,
            active = True,
            completed = False,
            refresh = False,
            voided = False,
            #FIXME : this should be configurable per tournament
            number_of_scores_per_entry = tom_config.scores_per_entry
        )

        if( existing_entries >= 1 or entry_num > 0):
            new_entry.active=False    
        DB.session.add(new_entry)
        player.entries.append(new_entry)
        DB.session.commit()
    print "done adding entry - to_dict is done"
    return jsonify(new_entry.to_dict_simple())



