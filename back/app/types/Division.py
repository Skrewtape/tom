"""Model object for a division in a tournament"""

from app import DB
from flask_restless.helpers import to_dict

Division_machine_mapping = DB.Table(
    'division_machines',
    DB.Column('division_id', DB.Integer, DB.ForeignKey('division.division_id')),
    DB.Column('machine_id',  DB.Integer, DB.ForeignKey('machine.machine_id'))
)

class Division(DB.Model):
    """Model object for a division in a tournament"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    division_id = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(1000))
    number_of_scores_per_entry = DB.Column(DB.Integer)
    tournament_id = DB.Column(DB.Integer, DB.ForeignKey(
        'tournament.tournament_id'
    ))
    
    tournament = DB.relationship(
         'Tournament',
         foreign_keys=[tournament_id]
    )

    # machines = DB.relationship(
    #     'Machine',
    #     secondary=Division_machine_mapping,
    #     backref=DB.backref('division'),
    #     lazy='joined'
    # )

    machines = DB.relationship(
        'DivisionMachine',
        lazy='joined'
    )
    
    def to_dict_with_machines(self):
        division = to_dict(self)
        if self.machines:
            division['machines']=[]
            for machine in self.machines:
                division['machines'].append(machine.to_dict_simple())
        return division
    
    def to_dict_simple(self):
        return to_dict(self)

