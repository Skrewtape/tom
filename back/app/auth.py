"""Stuff to set up Flask-Login, etc"""
from app import App
from app import Login_manager
from app.types import User

from collections import namedtuple

from flask_login import current_user
from flask_principal import identity_loaded, RoleNeed, UserNeed

@Login_manager.user_loader
def load_user(userid):
    """Load a user from the DB"""
    return User.query.get(int(userid))

# pylint: disable=no-member,unused-argument
# I don't know why pylint thinks connect_via doesn't exist; it totally does
# Also I'm not sure how to skip the sender argument, since I need identity
@identity_loaded.connect_via(App)
def on_identity_loaded(sender, identity):
    """Set up the Flask-Principal stuff for this user"""
    identity.user = current_user
    if hasattr(current_user, 'user_id'):
        identity.provides.add(UserNeed(current_user.user_id))
    if hasattr(current_user, 'roles'):
        for role in current_user.roles:
            identity.provides.add(RoleNeed(role.name))
