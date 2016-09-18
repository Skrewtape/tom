"""Model object for a 'token' for an entry"""

from app import DB
from flask_restless.helpers import to_dict


class CompToken(DB.Model):
    comp_token_id = DB.Column(DB.Integer, primary_key=True)
    num_tokens = DB.Column(DB.Integer)
    division_id = DB.Column(DB.Integer, DB.ForeignKey(
        'division.division_id'
    ))
    metadivision_id = DB.Column(DB.Integer, DB.ForeignKey(
        'metadivision.metadivision_id'
    ))    
    
    def to_dict_simple(self):
        return to_dict(self)        
