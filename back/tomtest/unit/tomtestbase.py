import os
import sys
dir = os.path.dirname(__file__)
dir = dir+"../../"
sys.path.append(dir)
from app import App
import unittest
import tempfile
#from seed_testing_db import init_clean_db
import inspect
import sqlalchemy
from flask import json, Response
from flask_login import login_user, logout_user, current_user
from flask_principal import Identity, RoleNeed, UserNeed
from sqlalchemy.exc import ArgumentError,InvalidRequestError,IntegrityError
from app.types import User, Tournament, Division
from app import auth, DB

admin_user_name='admin'
admin_user_password='admin'
all_roles_user_name='elizabeth'
all_roles_user_password='elizabeth'
non_admin_user_name='scorekeeper'
non_admin_user_password='scorekeeper'
non_existant_user='poop'
non_existant_user_password='poop'

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
        

class TomTestCase(unittest.TestCase):    
    
    def setUp(self):
        App.config['TESTING'] = True
        self.app = App.test_client()
        #init_clean_db()
        
