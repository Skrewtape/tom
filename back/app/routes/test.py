import json
from sqlalchemy import null
from flask import jsonify, request, abort
from flask_login import login_required
from app import App
from app.types import Score, Player, Division, Entry
from app import App, Admin_permission, DB
from app.routes.util import fetch_entity


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
 
