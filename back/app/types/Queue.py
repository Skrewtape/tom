"""Model object for machine queue"""

from app import DB
from flask_restless.helpers import to_dict


class Queue(DB.Model):
    queue_id = DB.Column(DB.Integer, primary_key=True)
    division_machine_id = DB.Column(DB.Integer, DB.ForeignKey(
        'division_machine.division_machine_id'
    ))
    player_id = DB.Column(DB.Integer, DB.ForeignKey(
        'player.player_id'
    ))
    player = DB.relationship('Player', uselist=False)
    division_machine = DB.relationship('DivisionMachine', uselist=False)

    def to_dict_simple(self):
        return_dict = to_dict(self)
        return_dict['first_name']=self.player.first_name
        return_dict['last_name']=self.player.last_name
        return_dict['machine']=self.division_machine.to_dict_simple()
        return return_dict
