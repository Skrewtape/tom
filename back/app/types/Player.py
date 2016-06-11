"""Model object for a player"""

from app import DB
from flask_restless.helpers import to_dict
from app.types import util, Team
import random
import math

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
    player_is_an_asshole_count = DB.Column(DB.Integer)
    first_name = DB.Column(DB.String(1000))
    last_name = DB.Column(DB.String(1000))
    search_name = DB.Column(DB.String(1000))
    email = DB.Column(DB.String(120))
    active = DB.Column(DB.Boolean, default=True)
    pin=DB.Column(DB.Integer,autoincrement=True)
    @DB.validates('email')
    def validate_email_wrapper(self,key,address):
        return util.validate_email(key,address)

    linked_division = DB.relationship(
        'Division',
        secondary=Player_Division_mapping        
    )
    team = DB.relationship(
        'Team',
        secondary=Team.Team_Player_mapping,
        lazy='joined'
    )
    
    division_machine = DB.relationship('DivisionMachine', uselist=False)

    def gen_pin(self):        
        random.seed()
        random_pin = random.randint(100,999)
        if self.player_id < 10:
            random_pin = self.player_id*100000+random_pin
        if self.player_id >=10 and self.player_id < 100:            
            random_pin = self.player_id*10000+random_pin
        if self.player_id >=100:            
            random_pin = self.player_id*1000+random_pin            
        #self.pin = random_pin
        self.pin = self.player_id
    
    def to_dict_with_team(self):
        player_dict = to_dict(self)
        if self.team:
            player_dict['team'] = self.team[0].to_dict_simple()
        return player_dict
    
    def to_dict_simple(self):
        return to_dict(self)        

    
