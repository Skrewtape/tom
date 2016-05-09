import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Entry, Score, Player, Division, Machine, DivisionMachine
from app import App, Admin_permission, Scorekeeper_permission, Void_permission, DB
from app.routes.util import fetch_entity, calculate_score_points_from_rank
from app import tom_config
from werkzeug.exceptions import Conflict, BadRequest

def check_player_can_start_new_entry(player_id,division_id):
    # if division tournament is team, lookup team_id for player
    # make sure no active entries for player
    # make sure player has more than 0 tokens for division
    pass

def create_active_entry(player_id,division_id):
    # if division tournament is team, lookup team_id for player
    # create entry ( set active )
    # delete token
    pass

@App.route('/entry/<entry_id>/void/<voided_state>', methods=['PUT'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Entry, 'entry')
def toggle_entry_voided(entry,voided_state):
    """set a entry voided state"""
    entry.voided = True if voided_state=="void" else False
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
    if entry.player.active is False:
        raise Conflict('Player is no longer active.  Please see the front desk')        
    division = Division.query.filter_by(division_id=entry.division_id).all()    
    if division_machine not in division[0].machines:
        raise Conflict('machine is not in division')            
    player = Player.query.filter_by(player_id=entry.player_id).all()[0]
    new_score = Score(
        score = new_score_value,
        division_machine_id = division_machine.division_machine_id
    )
    entry.scores.append(new_score)
    DB.session.commit()
    return jsonify(entry.to_dict_with_scores())


@App.route('/entry/<entry_id>/machine/<divisionmachine_id>/score/<new_score_value>', methods=['POST'])
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
    if entry.completed == True or entry.voided == True or entry.active == False:
        raise Conflict('entry is already completed or voided or inactive')
    entry.completed = True
    entry.active = False
    DB.session.commit()
    entries = Entry.query.filter_by(player_id=entry.player_id,completed=False,voided=False,division_id=entry.division_id).all()        
    if entries:
        entries[0].active = True
    DB.session.commit()
    return jsonify(entry.to_dict_with_scores())


@App.route('/entry/<entry_id>/complete', methods=['PUT'])
@login_required
@fetch_entity(Entry, 'entry')
def complete_entry_with_decorator(entry):
    """Complete specific entry"""    
    complete_entry(entry)
    # if entry.completed == True or entry.voided == True or entry.active == False:
    #     raise Conflict('entry is already completed or voided')
    # entry.completed = True
    # entry.active = False
    # DB.session.commit()
    # entries = Entry.query.filter_by(player_id=entry.player_id,completed=False,voided=False,division_id=entry.division_id).all()        
    # if entries:
    #     entries[0].active = True
    # DB.session.commit()
    # return jsonify(entry.to_dict_with_scores())

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



