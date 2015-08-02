"""Model object for a player"""

from app import DB

class Player(DB.Model):
    """Model object for a player"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    player_id = DB.Column(DB.Integer, primary_key=True)
    first_name = DB.Column(DB.String(1000))
    last_name = DB.Column(DB.String(1000))
