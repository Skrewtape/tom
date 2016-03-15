import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Entry, Score, Player, Division, Machine
from app import App, Admin_permission, Scorekeeper_permission, DB
from app.routes.util import fetch_entity
from app import tom_config
from werkzeug.exceptions import Conflict, BadRequest


@App.route('/entry/<entry_id>/void', methods=['PUT'])
@login_required
@Scorekeeper_permission.require(403)
@fetch_entity(Entry, 'entry')
def void_entry(entry):
    """Add a score for the entry"""
    if not entry.division.tournament.active:
        raise Conflict('tournament closed')    
    if entry.completed == True or entry.voided == True:
        raise Conflict('entry specified is already completed or voided')                
    entry.voided = True
    entry.player.machine_id = None
    existing_entry = Entry.query.filter_by(player_id=entry.player_id, voided=False, completed=False).first()
    if existing_entry:
        existing_entry.active = True        
    DB.session.commit()    
    return jsonify(entry.to_dict())



@App.route('/entry/<entry_id>', methods=['PUT'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Entry, 'entry')
def edit_entry(entry):
    """edit a entry"""
    entry_data = json.loads(request.data)    
    print entry_data
    if 'entry_id' not in entry_data:
        raise BadRequest('did not specify entry_id')
    old_entry = Entry.query.filter_by(entry_id=entry_data['entry_id']).first()        
    if not old_entry:
        raise BadRequest('entry_id specified (%s) is invalid' % entry_data['entry_id'])
    old_entry.voided = entry_data['voided']
    DB.session.commit()
    return jsonify(old_entry.to_dict_simple())

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
    if 'machine_id' in score_data:
        score.machine_id = score_data['machine_id']
    if 'score' in score_data:
        score.score = score_data['score']         
    DB.session.commit()
    return jsonify(score.to_dict_simple())

@App.route('/entry/<entry_id>/machine/<machine_id>/score/<new_score_value>', methods=['POST'])
@login_required
@fetch_entity(Entry, 'entry')
@fetch_entity(Machine, 'machine')
def add_score(entry,machine,new_score_value):
    if len(entry.scores) >= entry.number_of_scores_per_entry:
        raise Conflict('Entry already has enough scores')
    if any(score.machine_id ==  machine.machine_id for score in entry.scores):
        raise Conflict('Can not play the same game twice in one ticket')
    division = Division.query.filter_by(division_id=entry.division_id).all()    
    if machine not in division[0].machines:
        raise Conflict('machine is not in division')            
    player = Player.query.filter_by(player_id=entry.player_id).all()[0]
    player.machine = None
    new_score = Score(
        score = new_score_value,
        machine_id = machine.machine_id
    )
    entry.scores.append(new_score)
    DB.session.commit()
    return jsonify(entry.to_dict_with_scores())

@App.route('/entry/<entry_id>', methods=['GET'])
@fetch_entity(Entry, 'entry')
def get_entry(entry):
    """Return specific entry"""    
    return jsonify(entry.to_dict_with_scores())

@App.route('/entry/<entry_id>/complete', methods=['PUT'])
@login_required
@fetch_entity(Entry, 'entry')
def complete_entry(entry):
    """Complete specific entry"""    
    if entry.completed == True or entry.voided == True or entry.active == False:
        raise Conflict('entry is already completed or voided')
    entry.completed = True
    entry.active = False
    entries = Entry.query.filter_by(player_id=entry.player_id,completed=False,voided=False).all()        
    if entries:
        entries[0].active = True
    DB.session.commit()
    return jsonify(entry.to_dict_with_scores())


@App.route('/entry/machineId/<machine_id>', methods=['GET'])
def get_entries_for_machine(machine_id):
    entries = Entry.query.filter_by(completed=True,voided=False).join(Score).filter_by(machine_id=machine_id).all()            
    entries_dict={} 
    for entry in entries:
        entries_dict[entry.entry_id]=entry.to_dict_simple()
    return jsonify(entries_dict)


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
    for x in range(0, num_entrys):
        new_entry = Entry(
            division = division,
            active = True,
            completed = False,
            refresh = False,
            voided = False,
            #FIXME : this should be configurable per tournament
            number_of_scores_per_entry = tom_config.scores_per_entry
        )
        existing_entries = Entry.query.filter_by(player_id=player.player_id,division_id=division.division_id,completed=False,voided=False).count()    
        print "existing entries is %d " % existing_entries
        print "existing entries + new entries is %d %d" % (existing_entries,num_entrys)
        if existing_entries + num_entrys > tom_config.max_num_concurrent_entries:
            raise Conflict('already at max number of entries for user')
        if( existing_entries >= 1):
            new_entry.active=False    
        player.entries.append(new_entry)
        DB.session.add(new_entry)
        DB.session.commit()
    print "done adding entry - to_dict is done"
    return jsonify(new_entry.to_dict_simple())



