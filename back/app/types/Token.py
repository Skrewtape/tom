"""Model object for a 'token' for an entry"""

from app import DB
from flask_restless.helpers import to_dict


class Token(DB.Model):
    token_id = DB.Column(DB.Integer, primary_key=True)

    team_id = DB.Column(DB.Integer, DB.ForeignKey(
        'team.team_id'
    ))

    paid_for = DB.Column(DB.Boolean)

    
    player_id = DB.Column(DB.Integer, DB.ForeignKey(
        'player.player_id'
    ))
    division_id = DB.Column(DB.Integer, DB.ForeignKey(
        'division.division_id'
    ))
    metadivision_id = DB.Column(DB.Integer, DB.ForeignKey(
        'metadivision.metadivision_id'
    ))
    division = DB.relationship(
         'Division',
         foreign_keys=[division_id]
    )
    metadivision = DB.relationship(
         'Metadivision',
         foreign_keys=[metadivision_id]
    )
    player = DB.relationship(
         'Player',
         foreign_keys=[player_id]
    )
    team = DB.relationship(
         'Team',
         foreign_keys=[team_id]
    )
    
    def to_dict_simple(self):
        return to_dict(self)        
