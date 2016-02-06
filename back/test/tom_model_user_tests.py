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
                
    def test_User_no_roles_model(self):        
        user = app.types.User(
            username='test_user',
            email='test_user@test.com'
        )            
        user.crypt_password('test_user')                    
        DB.session.add(user)
        DB.session.commit()
        added_user = User.query.filter_by(username='test_user').first()
        self.assertIsInstance(added_user,app.types.User)

    def test_User_with_roles_model(self):        
        user = app.types.User(
            username='test_user',
            email='test_user@test.com'
        )
        user.crypt_password('test_user')        
        role = app.types.Role(name='admin')
        user.roles.append(role)        
        DB.session.add(user)
        DB.session.commit()
        added_user = User.query.filter_by(username='test_user').first()        
        self.assertEqual(len(added_user.roles),1,'Expected only one role, but got %s' % (len(added_user.roles)))

    def test_User_username_constraints(self):
        user = app.types.User(
            email='test_user@test.com'
        )
        user.crypt_password('test_user')        
        DB.session.add(user)        
        with self.assertRaises(IntegrityError):
            DB.session.commit()

        DB.session.rollback()
            
        with self.assertRaises(ArgumentError):
            user = app.types.User(
                username='vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvveeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeerrrrrrrrrrrrrrrrrrrrryyyyyyyyyylong',
                email='test_user@test.com'
            )
            DB.session.commit()

        DB.session.rollback()        
            
    def test_User_email_constraints(self):
        user = app.types.User(
            username='test_user'            
        )
        user.crypt_password('test_user')        
        DB.session.add(user)        
        with self.assertRaises(IntegrityError):
            DB.session.commit()
            
        DB.session.rollback()
            
        with self.assertRaises(ArgumentError):
            user = app.types.User(
                email='test_user-test.com'
            )
            DB.session.commit()

        DB.session.rollback()

    def test_to_dict(self):
        user = app.types.User(
            username='test_user',
            email='test_user@test.com'
        )            
        user.crypt_password('test_user')                    
        DB.session.add(user)
        DB.session.commit()
        added_user = User.query.filter_by(username='test_user').first()
        
        player_dict = added_user.to_dict()
        self.assertDictContainsSubset({'username':'test_user','email':'test_user@test.com'},
                                      player_dict,
                                      'Did not find all the user fields expected in to_dict() output')
        self.assertFalse(player_dict.has_key('password_crypt'),'Found a password in the User.to_dict() output')            
        
        
if __name__ == '__main__':
    unittest.main()
