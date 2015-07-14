"""Model object for a game manufacturer"""

from app import DB

class Manufacturer(DB.Model):
    """Model object for a game manufacturer"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    manufacturer_id = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(1000))
