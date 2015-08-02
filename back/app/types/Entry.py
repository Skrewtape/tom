"""Model object for an entry"""

from app import DB

class Entry(DB.Model):
    """Model object for an entry"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    entry_id = DB.Column(DB.Integer, primary_key=True)

    score = DB.Column(DB.Integer)

    player_id = DB.Column(DB.Integer, DB.ForeignKey(
        'player.player_id'
    ))
    player = DB.relationship(
        'Player',
        backref=DB.backref('entries'),
        foreign_keys=[player_id]
    )

    division_id = DB.Column(DB.Integer, DB.ForeignKey(
        'division.division_id'
    ))
    division = DB.relationship(
        'Division',
        backref=DB.backref('entries'),
        foreign_keys=[division_id]
    )

    machine_id = DB.Column(DB.Integer, DB.ForeignKey(
        'machine.machine_id'
    ))
    machine = DB.relationship(
        'Machine',
        backref=DB.backref('entries'),
        foreign_keys=[machine_id]
    )
