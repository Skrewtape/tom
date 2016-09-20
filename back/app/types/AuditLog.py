"""Model object for a 'token' for an entry"""

from app import DB
from flask_restless.helpers import to_dict


class AuditLogEntry(DB.Model):
    audit_log_entry_id = DB.Column(DB.Integer, primary_key=True)
    type = DB.Column(DB.String(25))
    timestamp = DB.Column(DB.Integer)
    player_id = DB.Column(DB.Integer)
    division_id = DB.Column(DB.Integer)
    division_machine_id = DB.Column(DB.Integer)
    entry_id=DB.Column(DB.Integer)
    metadivision_id=DB.Column(DB.Integer)
    available_tokens=DB.Column(DB.Integer)
    score_id = DB.Column(DB.Integer)
    score = DB.Column(DB.Integer)
    paid_for = DB.Column(DB.Integer)
    comped = DB.Column(DB.Boolean)
    token_id = DB.Column(DB.Integer)
    def to_dict_simple(self):
        return to_dict(self)        
