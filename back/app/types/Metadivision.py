"""Model object for a meta_division"""

from app import DB
from flask_restless.helpers import to_dict

class Metadivision(DB.Model):
    name = DB.Column(DB.String(1000))
    metadivision_id = DB.Column(DB.Integer, primary_key=True)
    divisions = DB.relationship("Division")

    def to_dict_simple(self):
        return to_dict(self)
