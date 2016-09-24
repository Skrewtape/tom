"""Model object for a player"""

from app import DB
from app import secret_config
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
    pin = DB.Column(DB.Integer, DB.Sequence(name='player_pin_seq',start=secret_config.player_pin_start,increment=secret_config.player_pin_increment))
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

    queue = DB.relationship('Queue', uselist=False)

    def verify_password(self, pin):        
        #return sha512_crypt.verify(password, self.password_crypt)
        if int(pin) == self.pin:
            return True
        else:
            return False
        
    
    @staticmethod
    def is_authenticated():
        """Players are always authenticated"""
        return True

    @staticmethod
    def is_active():
        """Players are always active"""
        return True

    @staticmethod
    def is_anonymous():
        """No anon players"""
        return False

    def get_id(self):
        """Get the players's id"""
        return self.player_id
    
    def gen_pin(self):        
        self.pin = self.player_id
    
    def to_dict_with_team(self):
        player_dict = to_dict(self)
        player_dict['pin']=None
        if self.team:
            player_dict['team'] = self.team[0].to_dict_simple()
        if self.queue:
            player_dict['queue']=self.queue.to_dict_simple()            
        return player_dict
    
    def to_dict_simple(self):
        player_dict = to_dict(self)
        player_dict['pin']=None
        if self.queue:
            player_dict['queue']=self.queue.to_dict_simple()
        return player_dict

    
