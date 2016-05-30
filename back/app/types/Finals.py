from app import DB
from flask_restless.helpers import to_dict
from app.types import util, Team

class Finals(DB.Model):
    """Model object for a division finals"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    finals_id = DB.Column(DB.Integer,primary_key=True)
    division_id = DB.Column(DB.Integer, DB.ForeignKey(
        'division.division_id'
    ))
    division_machines = DB.relationship(
        'DivisionMachine',
        lazy='joined'
    )
        
class FinalsMatch(DB.Model):
    """Model object for a division finals match"""    
    match_id = DB.Column(DB.Integer,primary_key=True)
    round_id = DB.Column(DB.Integer)
    finals_id = DB.Column(DB.Integer, DB.ForeignKey(
        'finals.finals_id'
    ))
    match_with_byes = DB.Column(DB.Boolean)
    parent_id = DB.Column(DB.Integer)
    
class FinalsPlayer(DB.Model):
    """Model object for a division finals players score"""        
    finals_player_id = DB.Column(DB.Integer,primary_key=True)
    match_id = DB.Column(DB.Integer, DB.ForeignKey(
        'finals_match.match_id'
    ))    
    player_id = DB.Column(DB.Integer, DB.ForeignKey(
        'player.player_id'
    ))
    finals_seed = DB.Column(DB.Integer)

class FinalsScore(DB.Model):
    match_id = DB.Column(DB.Integer, DB.ForeignKey(
        'finals_match.match_id'
    ))    
    finals_player_score_id = DB.Column(DB.Integer,primary_key=True)    
    finals_player_id = DB.Column(DB.Integer, DB.ForeignKey(
        'finals_player.finals_player_id'
    ))    
    score = DB.Column(DB.BIGINT)    
    game_number = DB.Column(DB.Integer)
    division_machine_id = DB.Column(DB.Integer, DB.ForeignKey(
        'division_machine.division_machine_id'
    ))

