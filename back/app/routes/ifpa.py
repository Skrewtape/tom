import json
import requests
from flask import jsonify, request
from flask_login import login_required
from app import App
from app import App, Admin_permission, Scorekeeper_permission, Void_permission, DB
import re

def get_ifpa_ranking_helper(player_name):
    content=requests.get('http://www.ifpapinball.com/ajax/searchplayer.php?search=%s' % player_name).content
    players = re.findall('player.php\?p=\d+\"\>([^\<]+)',content.lower())    
    #rank = re.search('(\d+)th|(\d+)nd|(\d+)st|(\d+)rd', content.lower())
    rank = re.findall('(\d+)th|(\d+)nd|(\d+)st|(\d+)rd', content.lower())
    actual_ranks = []
    for r in rank:
        for actual_r in r:
            if actual_r != "":
                actual_ranks.append(actual_r) 
    count = len(players)
    print "%s %s" % (actual_ranks,count)

    ifpa_results = {'count':count,'players':players,'rank':actual_ranks}    
    #if count > 0:
    #    ifpa_results['rank'] = rank.group(0)
    return ifpa_results

@App.route('/ifpa/<player_name>', methods=['GET'])
def get_ifpa_ranking(player_name):
    return jsonify(get_ifpa_ranking_helper(player_name))
