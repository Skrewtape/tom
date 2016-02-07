import os
from app import App
import unittest
import tempfile
from flask import json, Response
from flask_login import login_user, logout_user, current_user
from flask_principal import Identity, RoleNeed, UserNeed
from app.types import User
from app import auth
from seed_testing_db import init_db
from app import DB
import app.types
from sqlalchemy.exc import ArgumentError,InvalidRequestError,IntegrityError
from base_case import admin_user_name, all_roles_user_name, non_admin_user_name, non_existant_user
from base_case import admin_user_password, all_roles_user_password, non_admin_user_password, non_existant_user_password
import random
import time

class TomTestCase(unittest.TestCase):

    def login_before_test(username,password):
        def wrapper(f):
            def wrapper_f(*args):
                self = args[0]
                #It would be better if we didn't use the test_client() to
                #login, but it makes the tests easier to understand            
                rv = self.app.put('/login',
                                  data=json.dumps({'username':username,
                                                   'password':password})
                )
                f(*args)
            return wrapper_f            
        return wrapper
    
    def setUp(self):
        App.config['TESTING'] = True
        self.app = App.test_client()
        init_db()

    @login_before_test(admin_user_name,admin_user_password)
    def test_add_player(self):
        player = app.types.Player(first_name='aiton',last_name='goldman')                        
        DB.session.add(player)
        DB.session.commit()
        print Player.query.filter_by(first_name='aiton',last_name='goldman').first()
        
if __name__ == '__main__':
    unittest.main()
