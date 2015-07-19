"""Model object for a tournament"""

from app import DB

class Tournament(DB.Model):
    """Model object for a tournament"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    tournament_id = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(1000))
