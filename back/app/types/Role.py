"""Model object for a role"""
from app import DB
from flask_restless.helpers import to_dict

class Role(DB.Model):
    """Model object for a role"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    role_id = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(100))

    def to_dict_simple(self):
        return to_dict(self)
