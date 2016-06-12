"""Stuff to set up Flask-Login, etc"""
from app import App
from app import Login_manager
from app.types import User, Player

from collections import namedtuple

from flask_login import current_user
from flask_principal import identity_loaded, RoleNeed, UserNeed

import tom_config


if tom_config.player_login is False:
    @Login_manager.user_loader
    def load_user(userid):
        """Load a user from the DB"""
        return User.query.get(int(userid))
else:
    @Login_manager.user_loader
    def load_player(playerid):
        """Load a player from the DB"""
        return Player.query.get(int(playerid))
    
# pylint: disable=no-member,unused-argument
# I don't know why pylint thinks connect_via doesn't exist; it totally does
# Also I'm not sure how to skip the sender argument, since I need identity
#
# current_user is the currently logged in user ( from flask_login and then modified by flask_principal).
# identity gets the user id and the user roles added to it's provides property
@identity_loaded.connect_via(App)
def on_identity_loaded(sender, identity):
    """Set up the Flask-Principal stuff for this user"""
    identity.user = current_user
    if tom_config.player_login is False:
        if hasattr(current_user, 'user_id'):
            identity.provides.add(UserNeed(current_user.user_id))
    else:
        if hasattr(current_user, 'player_id'):            
            identity.provides.add(UserNeed(current_user.player_id))
        
    if tom_config.player_login is True:
        return
    if hasattr(current_user, 'roles'):
        for role in current_user.roles:
            identity.provides.add(RoleNeed(role.name))
