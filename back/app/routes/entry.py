import json
from sqlalchemy import null
from flask import jsonify, request, abort
from flask_login import login_required
from app import App
from app.types import Entry, Score
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity

@App.route('/entry/<entry_id>', methods=['PUT'])
@login_required
@Admin_permission.require(403)
@fetch_entity(Entry, 'entry')
def edit_entry(entry):
    """edit a entry"""
    entry_data = json.loads(request.data)    
    print entry_data
    if 'entry_id' not in entry_data:
        abort(400)
    old_entry = Entry.query.filter_by(entry_id=entry_data['entry_id']).first()        
    if not old_entry:
        abort(400)
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
    if not old_entry or not score:
        abort(400)
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
    if not score:
        abort(400)
    if 'machine_id' in score_data:
        score.machine_id = score_data['machine_id']
        print "found machine id"
    if 'score' in score_data:
        score.score = score_data['score']         
        print "found score id"
    DB.session.commit()
    return jsonify(score.to_dict_simple())

