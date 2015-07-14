"""Model object for a game machine"""

from app import DB
from re import compile, UNICODE
from sqlalchemy.ext.hybrid import hybrid_property


strip_pattern = compile('[\W_]+', UNICODE)

class Machine(DB.Model):
    """Model object for a game machine"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    machine_id = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(1000))
    search_name = DB.Column(DB.String(1000))
    year = DB.Column(DB.SmallInteger())

    @hybrid_property
    def search_name(self):
        return string_pattern.sub('', self.name.lower())

    manufacturer_id = DB.Column(DB.Integer, DB.ForeignKey(
        'manufacturer.manufacturer_id'
    ))
    manufacturer = DB.relationship(
        'Manufacturer',
        backref=DB.backref('machines'),
        foreign_keys=[manufacturer_id]
    )
