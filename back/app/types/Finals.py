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
    """Model object for a player"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    finals_id = DB.Column(DB.Integer,primary_key=True)
