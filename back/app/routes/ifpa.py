import json
import requests
from flask import jsonify, request
from flask_login import login_required
from app import App
from app import App, Admin_permission, Scorekeeper_permission, Void_permission, DB
import re

@App.route('/ifpa/<player_name>', methods=['GET'])
def get_ifpa_ranking(player_name):
    content=requests.get('http://www.ifpapinball.com/ajax/searchplayer.php?search=%s' % player_name).content
    players = re.findall('player.php\?p=\d+\"\>([^\<]+)',content.lower())
    print content
    rank = re.search('(\d+)th|(\d+)nd|(\d+)st|(\d+)rd', content.lower())
    count = len(players)
    print "%s %s" % (rank,count)

    ifpa_results = {'count':count,'players':players,'rank':''}    
    if count > 0:
        ifpa_results['rank'] = rank.group(0)
    return jsonify(ifpa_results)
