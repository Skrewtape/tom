"""Model object for a division in a tournament"""

from app import DB
from flask_restless.helpers import to_dict

Division_machine_mapping = DB.Table(
    'division_machine',
    DB.Column('division_id', DB.Integer, DB.ForeignKey('division.division_id')),
    DB.Column('machine_id',  DB.Integer, DB.ForeignKey('machine.machine_id'))
)

class Division(DB.Model):
    """Model object for a division in a tournament"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    division_id = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(1000))

    tournament_id = DB.Column(DB.Integer, DB.ForeignKey(
        'tournament.tournament_id'
    ))
    tournament = DB.relationship(
        'Tournament',
        backref=DB.backref('divisions'),
        foreign_keys=[tournament_id]
    )

    machines = DB.relationship(
        'Machine',
        secondary=Division_machine_mapping,
        backref=DB.backref('machines', lazy='dynamic')
    )

    def to_dict_simple(self):
        return to_dict(self)

    def to_dict_with_relationships(self):
        division = to_dict(self)
        tournament = self.tournament
        machines = self.machines
        if tournament:
            division['tournament']= to_dict(tournament)
            ##division['tournament']= tournament.to_dict_simple()
        if machines:
            division['machines']=[]
            for machine in machines:                
                division['machines'].append(to_dict(machine))        
                ##division['machines'].append(machine.to_dict())        
        return division
