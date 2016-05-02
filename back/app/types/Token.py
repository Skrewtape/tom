"""Model object for a 'token' for an entry"""

from app import DB
from flask_restless.helpers import to_dict

# use case : purchase 1 or more tokens for active tournament 
#
# lookup list of tourneys/divisions, display
# create token(s), linked to division and player
 
# use case : purchase 1 or more tokens for meta-tournament (i.e. classics)
#
# lookup list of tourneys and meta tourneys, and merge the list (i.e. remove any tourneys in meta list, replace with meta tourney)
## when looking up divisions, if it has a metadivision id, potentially display that name
# create tokens(s), linked to 
#
# use case : purchase 1 or more tokens for team
## create Team table
## refrence team in token

# use case : void ticket while 1 or more tokens still available ( for active tourney )
# use case : void ticket while 1 or more tokens still available ( for meta tourney )
# use case : complete ticket while 1 or more tokens still available ( for active tourney )
# use case : complete ticket while 1 or more tokens still available ( for meta tourney )

class Token(DB.Model):
    token_id = DB.Column(DB.Integer, primary_key=True)

    team_id = DB.Column(DB.Integer, DB.ForeignKey(
        'team.team_id'
    ))

    player_id = DB.Column(DB.Integer, DB.ForeignKey(
        'player.player_id'
    ))
    division_id = DB.Column(DB.Integer, DB.ForeignKey(
        'division.division_id'
    ))
    metadivision_id = DB.Column(DB.Integer, DB.ForeignKey(
        'metadivision.metadivision_id'
    ))
    division = DB.relationship(
         'Division',
         foreign_keys=[division_id]
    )
    metadivision = DB.relationship(
         'Metadivision',
         foreign_keys=[metadivision_id]
    )
    player = DB.relationship(
         'Player',
         foreign_keys=[player_id]
    )
    team = DB.relationship(
         'Team',
         foreign_keys=[team_id]
    )
    
    

    pass

