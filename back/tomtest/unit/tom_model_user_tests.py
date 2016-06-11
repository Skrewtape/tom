import os
import tomtestbase
import unittest
import tempfile
from app import DB
from app.types import User, Role
from sqlalchemy.exc import ArgumentError,InvalidRequestError,IntegrityError

class TestModelUserCase(tomtestbase.TomTestCase):
                
    def test_User_username_constraints(self):
        user = User(
            email='test_user@test.com'
        )
        user.crypt_password('test_user')        
        DB.session.add(user)        
        with self.assertRaises(IntegrityError):
            DB.session.commit()

        DB.session.rollback()
            
        with self.assertRaises(ArgumentError):
            user = User(
                username='vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvveeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeerrrrrrrrrrrrrrrrrrrrryyyyyyyyyylong',
                email='test_user@test.com'
            )
            DB.session.commit()

        DB.session.rollback()        
            
    def test_User_email_constraints(self):
        user = User(
            username='test_user'            
        )
        user.crypt_password('test_user')        
        DB.session.add(user)        
        with self.assertRaises(IntegrityError):
            DB.session.commit()
            
        DB.session.rollback()
            
        with self.assertRaises(ArgumentError):
            user = User(
                email='test_user-test.com'
            )
            DB.session.commit()

        DB.session.rollback()

    def test_to_dict_simple(self):
        user = User(
            username='test_user',
            email='test_user@test.com'
        )            
        user.crypt_password('test_user')                    
        DB.session.add(user)
        DB.session.commit()
        added_user = User.query.filter_by(username='test_user').first()
        
        player_dict = added_user.to_dict_simple()
        self.assertDictContainsSubset({'username':'test_user','email':'test_user@test.com'},
                                      player_dict,
                                      'Did not find all the user fields expected in to_dict() output')
        self.assertFalse(player_dict.has_key('password_crypt'),'Found a password in the User.to_dict() output')            
        
        
if __name__ == '__main__':
    unittest.main()
