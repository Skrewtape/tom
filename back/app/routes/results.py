import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Player, Division, Entry, Score, Tournament, Team
from app import App, Admin_permission, Desk_permission, DB
from app.routes.util import fetch_entity, calculate_score_points_from_rank
from werkzeug.exceptions import Conflict

@App.route('/results/division/<division_id>')
def results_divisions(division_id=None):    
    return render_template('templates/divisions.html', division_id=division_id)

    
