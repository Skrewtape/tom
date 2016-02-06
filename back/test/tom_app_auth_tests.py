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

class TomAppAuthTestCase(unittest.TestCase):

    def setUp(self):
        App.config['TESTING'] = True
        self.app = App.test_client()
        init_db()
        self.all_roles_user = User.query.filter_by(username=all_roles_user_name).first()
                
    def test_on_identity_loaded_no_roles(self):
        no_roles_identity_to_test = Identity(-1)
        no_roles_needs = {UserNeed(None)}
        with App.app_context() as c:
            with App.test_request_context('/') as c:
                login_user(User())
                auth.on_identity_loaded(None,no_roles_identity_to_test)
                assert len(no_roles_identity_to_test.provides) == 1
                assert no_roles_needs == no_roles_identity_to_test.provides        
                
    def test_on_identity_loaded_all_roles(self):
        all_roles_user_id=self.all_roles_user.user_id
        all_roles_identity_to_test = Identity(all_roles_user_id)
        all_roles_needs = {RoleNeed('admin'), RoleNeed('scorekeeper'), UserNeed(all_roles_user_id)}
        with App.app_context() as c:
            with App.test_request_context('/') as c:                            
                login_user(self.all_roles_user)
                auth.on_identity_loaded(None,all_roles_identity_to_test)
                assert len(all_roles_identity_to_test.provides) == 3
                assert all_roles_needs == all_roles_identity_to_test.provides                                
                
if __name__ == '__main__':
    unittest.main()
