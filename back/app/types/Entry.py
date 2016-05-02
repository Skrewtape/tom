"""Model object for an entry"""

from app import DB
from flask_restless.helpers import to_dict

from app.types import Score

class Entry(DB.Model):
    """Model object for an entry"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    entry_id = DB.Column(DB.Integer, primary_key=True)
    completed = DB.Column(DB.Boolean)
    voided = DB.Column(DB.Boolean)        
    rank = DB.Column(DB.Integer)
    score = DB.Column(DB.Integer)
    refresh = DB.Column(DB.Boolean)
    number_of_scores_per_entry = DB.Column(DB.Integer)
    active = DB.Column(DB.Boolean)
    player_id = DB.Column(DB.Integer, DB.ForeignKey(
        'player.player_id'
    ))
    team_id = DB.Column(DB.Integer, DB.ForeignKey(
        'team.team_id'
    ))
    
    division_id = DB.Column(DB.Integer, DB.ForeignKey(
        'division.division_id'
    ))
    division = DB.relationship(
        'Division',
        backref=DB.backref('entries'),
        foreign_keys=[division_id]
    )    
    player = DB.relationship(
        'Player',
        backref=DB.backref('entries'),
        foreign_keys=[player_id]
    )
    
    scores = DB.relationship("Score",
                             lazy='joined'
    )
    
    def to_dict_simple(self):
        return to_dict(self)        

    def test_to_dict_with_scores(self):
        entry = to_dict(self)        
        #scores = DB.session.query(self).filter_by(entry_id=self.entry_id).all()

        scores = self.scores
        
        if scores:
            entry['scores'] = []
            for score in scores:                
                entry['scores'].append(score.to_dict_simple())
        return entry
    
    def to_dict_with_scores(self):
        entry = to_dict(self)        
        scores = self.scores
        if scores:
            entry['scores'] = []
            for score in scores:                
                entry['scores'].append(score.to_dict_simple())
        return entry
