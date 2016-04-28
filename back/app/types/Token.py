"""Model object for a 'token' for an entry"""

from app import DB
from flask_restless.helpers import to_dict

# token :
#  player_id
#  division_id
#  meta_division_id

# meta_division :
# meta_division_id
# one to many division_id


# use case : purchase 1 or more tokens for active tournament 
#
# lookup list of tourneys/divisions, display
# create token(s), linked to division and player
 
# use case : purchase 1 or more tokens for meta-tournament (i.e. classics)
#
# lookup list of tourneys and meta tourneys, and merge the list (i.e. remove any tourneys in meta list, replace with meta tourney)
# create tokens(s), linked to 
# use case : void ticket while 1 or more tokens still available ( for active tourney )
# use case : void ticket while 1 or more tokens still available ( for meta tourney )
# use case : complete ticket while 1 or more tokens still available ( for active tourney )
# use case : complete ticket while 1 or more tokens still available ( for meta tourney )

class Token(DB.Model):
    token_id = DB.Column(DB.Integer, primary_key=True)
    pass

