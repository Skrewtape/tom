"""Model object for a game machine in a specific division"""

from app import DB
from flask_restless.helpers import to_dict

class DivisionMachine(DB.Model):
    """Model object for a game machine"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason    
    removed = DB.Column(DB.Boolean, default=False)
    division_machine_id = DB.Column(DB.Integer, primary_key=True)
    #FIXME : need constraint on machine_id + division_id    
    machine_id = DB.Column(DB.Integer, DB.ForeignKey(
        'machine.machine_id'
    ))
    division_id = DB.Column(DB.Integer, DB.ForeignKey(
        'division.division_id'
    ))
    finals_id = DB.Column(DB.Integer, DB.ForeignKey(
        'finals.finals_id'
    ))    
    team_id = DB.Column(DB.Integer, DB.ForeignKey(
        'team.team_id'
    ))    
    player_id = DB.Column(DB.Integer, DB.ForeignKey(
        'player.player_id'
    ))    
    division = DB.relationship(
        'Division',
        foreign_keys=[division_id]
    )    
    machine = DB.relationship(
        'Machine',
        foreign_keys=[machine_id]
    )
    team = DB.relationship(
        'Team',
        foreign_keys=[team_id]
    )    
    player = DB.relationship('Player')    

    
    def to_dict_simple(self):
        division_machine = to_dict(self)
        division_machine['name'] = self.machine.name
        division_machine['abbreviation'] = self.machine.abbreviation        
        return division_machine

    def to_dict_with_player(self):
        machine = to_dict(self)
        if self.player:
            machine['player'] = self.player.to_dict_simple()
        return machine
    

