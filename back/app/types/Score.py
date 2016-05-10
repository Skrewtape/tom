from app import DB
from sqlalchemy.exc import ArgumentError
from app import tom_config
from flask_restless.helpers import to_dict

class Score(DB.Model):    
    score_id = DB.Column(DB.Integer, primary_key=True)
    score = DB.Column(DB.BIGINT)    
    rank = DB.Column(DB.Integer)
    
    entry_id = DB.Column(DB.Integer, DB.ForeignKey(
        'entry.entry_id'
    ))
        
    entry = DB.relationship(
        'Entry',
        foreign_keys=[entry_id]
    )

    division_machine_id = DB.Column(DB.Integer, DB.ForeignKey(
        'division_machine.division_machine_id'
    ))
    
    division_machine = DB.relationship(
        'DivisionMachine',
        foreign_keys=[division_machine_id]
    )
    
    def to_dict_simple(self):
        return to_dict(self)
        
    
