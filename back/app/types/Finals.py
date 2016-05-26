from app import DB
from flask_restless.helpers import to_dict
from app.types import util, Team

# finals design
#
# finals : 
#  division_id
#  matches
#
# finals_match
#  round
#  finals_id
#  child
#  parent
#
# finals_group
#  machine
#  finals_match
#
# finals_player_score
#  finals_player_id
#  finals_score
#  finals_group



class Finals(DB.Model):
    """Model object for a division finals"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    finals_id = DB.Column(DB.Integer,primary_key=True)
    division_id = DB.Column(DB.Integer, DB.ForeignKey(
        'division.division_id'
    ))

class FinalsMatch(DB.Model):
    """Model object for a division finals match"""    
    match_id = DB.Column(DB.Integer,primary_key=True)    
    round_id = DB.Column(DB.Integer)
    finals_id = DB.Column(DB.Integer, DB.ForeignKey(
        'finals.finals_id'
    ))

class FinalsGroup(DB.Model):
    """Model object for a division finals group"""    
    finals_group_id = DB.Column(DB.Integer,primary_key=True)    
    division_machine_id = DB.Column(DB.Integer, DB.ForeignKey(
        'division_machine.division_machine_id'
    ))

class FinalsPlayerScore(DB.Model):
    """Model object for a division finals players score"""        
    finals_player_score_id = DB.Column(DB.Integer,primary_key=True)    
    finals_group_id = DB.Column(DB.Integer, DB.ForeignKey(
        'finals_group.finals_group_id'
    ))
    finals_score = DB.Column(DB.Integer)
