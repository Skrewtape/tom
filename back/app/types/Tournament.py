"""Model object for a tournament"""

from app import DB
from flask_restless.helpers import to_dict

class Tournament(DB.Model):
    """Model object for a tournament"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    tournament_id = DB.Column(DB.Integer, primary_key=True)
    team_tournament = DB.Column(DB.Boolean)
    name = DB.Column(DB.String(1000))
    active = DB.Column(DB.Boolean)
    single_division = DB.Column(DB.Boolean)
    divisions = DB.relationship('Division',lazy='joined')

    def to_dict_with_divisions(self): #killroy was here
        tournament = to_dict(self)
        if self.divisions:
            tournament['divisions']=[]
            for division in self.divisions:
                tournament['divisions'].append(division.to_dict_with_machines())
        return tournament
    
    def to_dict_simple(self):
        return to_dict(self)

        

    
    
