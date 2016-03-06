from app import DB
from sqlalchemy.exc import ArgumentError
from app import tom_config
from flask_restless.helpers import to_dict

class Score(DB.Model):    
    score_id = DB.Column(DB.Integer, primary_key=True)
    score = DB.Column(DB.Integer)    
    rank = DB.Column(DB.Integer)
    
    entry_id = DB.Column(DB.Integer, DB.ForeignKey(
        'entry.entry_id'
    ))
        
    # entry = DB.relationship(
    #     'Entry',
    #     backref=DB.backref('scores'),
    #     foreign_keys=[entry_id],
    #     lazy='joined'
    # )

    machine_id = DB.Column(DB.Integer, DB.ForeignKey(
        'machine.machine_id'
    ))
    machine = DB.relationship(
        'Machine',
        backref=DB.backref('entries'),
        foreign_keys=[machine_id]
    )
    
    def to_dict_simple(self):
        return to_dict(self)
        
    
