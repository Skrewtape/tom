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
    metadivision_id = DB.Column(DB.Integer, DB.ForeignKey(
        'metadivision.metadivision_id'
    ))
    division_id = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(100))
    number_of_scores_per_entry = DB.Column(DB.Integer)
    stripe_sku = DB.Column(DB.String(100))
    tournament_id = DB.Column(DB.Integer, DB.ForeignKey(
        'tournament.tournament_id'
    ))
    
    tournament = DB.relationship(
         'Tournament',
         foreign_keys=[tournament_id]
    )
    metadivision = DB.relationship(
         'Metadivision',
         foreign_keys=[metadivision_id]
    )

    machines = DB.relationship(
        'DivisionMachine',
        lazy='joined'
    )
    
    def to_dict_with_machines(self): #killroy was here
        division = to_dict(self)        
        if self.machines:
            #FIXME : this should be returning the machines as a dict
            division['machines']=[]
            for machine in self.machines:
                division['machines'].append(machine.to_dict_simple())        
        return division
    
    def to_dict_simple(self):
        division = to_dict(self)
        division['tournament_name'] = self.tournament.name        
        return division

