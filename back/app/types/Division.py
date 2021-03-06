"""Model object for a division in a tournament"""

from app import DB

Division_machine_mapping = DB.Table(
    'division_machine',
    DB.Column('division_id', DB.Integer, DB.ForeignKey('division.division_id')),
    DB.Column('machine_id',  DB.Integer, DB.ForeignKey('machine.machine_id')  )
)

class Division(DB.Model):
    """Model object for a division in a tournament"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    division_id = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(1000))

    tournament_id = DB.Column(DB.Integer, DB.ForeignKey(
        'tournament.tournament_id'
    ))
    tournament = DB.relationship(
        'Tournament',
        backref=DB.backref('divisions'),
        foreign_keys=[tournament_id]
    )

    machines = DB.relationship(
        'Machine',
        secondary=Division_machine_mapping,
        backref=DB.backref('machines', lazy='dynamic')
    )
