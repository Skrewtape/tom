"""Model object for a team (i.e. splitflipper team)"""

from app import DB
from flask_restless.helpers import to_dict

Team_Player_mapping = DB.Table(
    'team_player_mapping',
    DB.Column('player_id', DB.Integer, DB.ForeignKey('player.player_id')),
    DB.Column('team_id', DB.Integer, DB.ForeignKey('team.team_id'))
)

class Team(DB.Model):
    #FIXME : tie a team to a specific tournament/division
    team_id = DB.Column(DB.Integer, primary_key=True)
    team_name = DB.Column(DB.String(1000))
    players = DB.relationship(
        'Player',
        secondary=Team_Player_mapping        
    )
