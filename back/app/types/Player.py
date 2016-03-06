"""Model object for a player"""

from app import DB
from flask_restless.helpers import to_dict
from app.types import util

Player_Division_mapping = DB.Table(
    'player_division',
    DB.Column('player_id', DB.Integer, DB.ForeignKey('player.player_id')),
    DB.Column('division_id', DB.Integer, DB.ForeignKey('division.division_id'))
)

class Player(DB.Model):
    """Model object for a player"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    player_id = DB.Column(DB.Integer,primary_key=True)
    first_name = DB.Column(DB.String(1000))
    last_name = DB.Column(DB.String(1000))
    search_name = DB.Column(DB.String(1000))
    email = DB.Column(DB.String(120))
    @DB.validates('email')
    def validate_email_wrapper(self,key,address):
        return util.validate_email(key,address)

    linked_division = DB.relationship(
        'Division',
        secondary=Player_Division_mapping        
    )
    
    machine_id = DB.Column(DB.Integer, DB.ForeignKey(
        'machine.machine_id'
    ))

    machine = DB.relationship(
        'Machine',
        backref=DB.backref('player'),
        foreign_keys=[machine_id]        
    )

    # active_tournaments_entries = DB.relationship(
    #     'Entry',
    #     secondary="join(Entry,Division,Entry.division_id==Division.division_id)",        
    #     primaryjoin="Player.player_id==Entry.player_id",                
    #     secondaryjoin="and_(Division.division_id==Entry.division_id,"
    #     "and_(Division.tournament_id==Tournament.tournament_id,"
    #     "Tournament.active==True))"
    # )
            
    def to_dict_simple(self):
        return to_dict(self)        

    
