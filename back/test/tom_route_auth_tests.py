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



class TomRouteAuthTestCase(unittest.TestCase):
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
    def test_GET_user_with_admin_login(self):
        rv = self.app.get('/user')
        returned_users = json.loads(rv.data)    
        self.assertIn('users',returned_users,'No users were returned, but users were expected')
        self.assertEquals(rv.status_code,200,'Was expecting status code 200, but it was %s' % (rv.status_code))
        self.assertEquals(len(returned_users['users']),4,'Expecting 4 results,got %s' % (len(returned_users['users'])))

    @login_before_test(non_admin_user_name,non_admin_user_password)
    def test_GET_user_with_non_admin_login(self):
        rv = self.app.get('/user')                
        returned_users = json.loads(rv.data)    
        self.assertNotIn('users',returned_users,'Users were returned, but none expected')
        self.assertEquals(rv.status_code,403,'Status code was not 403, it was %s ' % (rv.status_code))                

    @login_before_test(non_existant_user,non_existant_user_password)
    def test_GET_user_with_invalid_user(self):
        rv = self.app.get('/user')                        
        returned_users = json.loads(rv.data)    
        self.assertNotIn('users',returned_users,'Users were returned, but none expected')
        self.assertEquals(rv.status_code,401,'Status code was not 401, it was %s ' % (rv.status_code))                

        
    @login_before_test(admin_user_name,admin_user_password)        
    def test_GET_role_with_admin_login(self):
        rv = self.app.get('/role')                
        returned_roles = json.loads(rv.data)    
        self.assertIn('roles',returned_roles,'No roles were returned, but roles were expected')
        self.assertEquals(rv.status_code,200,'Status code was not 200, it was %s' % (rv.status_code))
        self.assertEquals(len(returned_roles['roles']),2,'Expecting 2 results,got %s' % (len(returned_roles['roles'])))
    
    @login_before_test(non_admin_user_name,non_admin_user_password)
    def test_GET_role_with_non_admin_login(self):
        rv = self.app.get('/role')
        returned_roles = json.loads(rv.data)    
        self.assertNotIn('roles',returned_roles,'Roles were returned, but none expected')
        self.assertEquals(rv.status_code,403,'Status code was not 403, it was %s ' % (rv.status_code))                

    @login_before_test(non_existant_user,non_existant_user_password)
    def test_GET_role_with_invalid_user(self):
        rv = self.app.get('/role')
        returned_roles = json.loads(rv.data)    
        self.assertNotIn('roles',returned_roles,'Roles were returned, but none expected')
        self.assertEquals(rv.status_code,401,'Status code was not 403, it was %s ' % (rv.status_code))                
        
    @login_before_test(admin_user_name,admin_user_password)    
    def test_PUT_user_with_admin_login(self):
        user = User.query.filter_by(username=admin_user_name).first()
        self.assertEquals(len(user.roles),1,'expected 1 roles, found %s' % (len(user.roles)))
        rv = self.app.put('/user/current',
                          data=json.dumps({'roles':['admin','scorekeeper']})
        )        
        self.assertEquals(rv.status_code,200,'Expected status to be 200, but got %s' % (rv.status_code))
        updated_user = User.query.filter_by(username=admin_user_name).first()
        self.assertEquals(len(updated_user.roles),2,'expected 2 roles, found %s' % (len(updated_user.roles)))

    @login_before_test(admin_user_name,admin_user_password)    
    def test_PUT_user_with_bad_role_admin_login(self):
        user = User.query.filter_by(username=admin_user_name).first()
        self.assertEquals(len(user.roles),1,'expected 1 roles, found %s' % (len(user.roles)))

        rv = self.app.put('/user/current',
                          data=json.dumps({'roles':['admin','scorekeeper','poop']})
        )
        
        self.assertEquals(rv.status_code,422,'Expected status to be 422, but got %s' % (rv.status_code))
        updated_user = User.query.filter_by(username=admin_user_name).first()
        self.assertEquals(len(updated_user.roles),1,'expected 1 roles, found %s' % (len(updated_user.roles)))
        
    @login_before_test(non_existant_user,non_existant_user_password)    
    def test_PUT_user_with_non_existant_login(self):        
        user = User.query.filter_by(username=non_admin_user_name).first()
        self.assertEquals(len(user.roles),1,'expected 1 roles, found %s' % (len(user.roles)))
        rv = self.app.put('/user/current',
                          data=json.dumps({'roles':['admin','scorekeeper']})
        )
        self.assertEquals(rv.status_code,401,'Expected status to be 401, but got %s' % (rv.status_code))
        updated_user = User.query.filter_by(username=non_admin_user_name).first()
        self.assertEquals(len(updated_user.roles),1,'expected 1 roles after update, found %s' % (len(updated_user.roles)))

    @login_before_test(non_admin_user_name,non_admin_user_password)
    def test_PUT_user_with_non_admin_login(self):        
        user = User.query.filter_by(username=non_admin_user_name).first()
        self.assertEquals(len(user.roles),1,'expected 1 roles, found %s' % (len(user.roles)))
        rv = self.app.put('/user/current',
                          data=json.dumps({'roles':['admin','scorekeeper']})
        )
        self.assertEquals(rv.status_code,403,'Expected status to be 403, but got %s' % (rv.status_code))
        updated_user = User.query.filter_by(username=non_admin_user_name).first()
        self.assertEquals(len(updated_user.roles),1,'expected 1 roles after update, found %s' % (len(updated_user.roles)))        
        
    @login_before_test(non_existant_user,non_existant_user_password)    
    def test_PUT_user_with_invalid_user(self):        
        rv = self.app.put('/user/current',
                          data=json.dumps({'roles':['admin','scorekeeper']})
        )
        self.assertEquals(rv.status_code,401,'Expected status to be 401, but got %s' % (rv.status_code))
        self.assertNotIn(rv.data, 'roles')


    @login_before_test(admin_user_name,admin_user_password)
    def test_GET_user_with_userid_admin_login(self):
        user = User.query.filter_by(username=non_admin_user_name).first()
        rv = self.app.get('/user/%s' % (user.user_id))                
        returned_user = json.loads(rv.data)            
        self.assertIn('username',returned_user,'expected username, but username was not found')
        self.assertEquals(returned_user['username'],non_admin_user_name,'expected %s as username, but username was %s' % (non_admin_user_name,returned_user['username']))
        self.assertEquals(rv.status_code,200,'Was expecting status code 200, but it was %s' % (rv.status_code))


    @login_before_test(admin_user_name,admin_user_password)
    def test_GET_user_with_current_user_admin_login(self):
        user = User.query.filter_by(username='admin').first()
        rv = self.app.get('/user/current')                
        returned_user = json.loads(rv.data)            
        self.assertIn('username',returned_user,'expected username, but username was not found')
        self.assertEquals(returned_user['username'],admin_user_name,'expected %s as username, but username was %s' % (admin_user_name,returned_user['username']))
        self.assertEquals(rv.status_code,200,'Was expecting status code 200, but it was %s' % (rv.status_code))

    
    def test_GET_user_with_current_user_invalid_user(self):
        rv = self.app.get('/user/current')                
        returned_user = json.loads(rv.data)            
        self.assertNotIn('username',returned_user,'expected no username, but username was found')
        self.assertEquals(rv.status_code,401,'Was expecting status code 401, but it was %s' % (rv.status_code))

        
    
    def test_GET_user_with_invalid_user(self):
        user = User.query.filter_by(username=all_roles_user_name).first()    
        rv = self.app.get('/user/%s' % (user.user_id))                
        returned_user = json.loads(rv.data)            
        self.assertNotIn('username',returned_user,'expected no username, but username was found')        
        self.assertEquals(rv.status_code,401,'Was expecting status code 401, but it was %s' % (rv.status_code))

    
    def test_PUT_login(self):        
        user = User.query.filter_by(username=admin_user_name).first()
        with App.test_client() as c:
            rv = c.put('/login',
                  data=json.dumps({'username':admin_user_name,'password':admin_user_password}))
            self.assertEquals(hasattr(current_user, 'username'),True,"Was expecting current_user to have a username attr, but it did not")
            self.assertEquals(current_user.username,user.username,"expected user to be %s, but got %s" % (user.username, current_user.username))
            self.assertEquals(rv.status_code,200,'Was expecting status code 200, but it was %s' % (rv.status_code))
            
    def test_PUT_login_invalid_user(self):        
        with App.test_client() as c:
            rv = c.put('/login',
                  data=json.dumps({'username':non_existant_user,'password':non_existant_user_password}))
            self.assertNotEquals(hasattr(current_user, 'username'),True,"Was expecting current_user to have a username attr, but it did not")
            self.assertEquals(rv.status_code,401,'Was expecting status code 401, but it was %s' % (rv.status_code))
    
    def test_PUT_logout(self):                
        user = User.query.filter_by(username=admin_user_name).first()
        with App.test_client() as c:
            rv = c.put('/login',    
                       data=json.dumps({'username':admin_user_name,'password':admin_user_password}))
            rv = c.put('/logout')
            self.assertNotEquals(hasattr(current_user, 'username'),True,"Was expecting current_user to not have username attr, but it did")
            self.assertEquals(rv.status_code,200,'Was expecting status code 200, but it was %s' % (rv.status_code))

    def test_PUT_not_logged_in_logout(self):                
        with App.test_client() as c:
            rv = c.put('/logout')    
            self.assertNotEquals(hasattr(current_user, 'username'),True,"Was expecting current_user to not have a username attr, but it did")
            self.assertEquals(rv.status_code,401,'Was expecting status code 401, but it was %s' % (rv.status_code))

    @login_before_test(admin_user_name,admin_user_password)
    def test_POST_user(self):                         
        rv = self.app.post('/user',    
                           data=json.dumps({'username':'new_user','password':'new_user','email':'new_user@new_user.com'}))        
        user = User.query.filter_by(username='new_user').first()
        self.assertEquals('new_user',user.username)
        self.assertEquals('new_user@new_user.com',user.email)        
        rv = self.app.put('/logout')        
        rv = self.app.put('/login',    
                          data=json.dumps({'username':'new_user','password':'new_user'}))
        self.assertEquals(rv.status_code,200)



    @login_before_test(non_admin_user_name,non_admin_user_password)
    def test_POST_user_non_admin(self):                                 
        rv = self.app.post('/user',    
                           data=json.dumps({'username': 'new_user','password':'new_user','email':'new_user@new_user.com'}))        
        self.assertEquals(403,rv.status_code)
        user = User.query.filter_by(username='new_user').first()        
        self.assertEquals(user,None)

    
    def test_POST_user_not_logged_in(self):                                 
        rv = self.app.post('/user',    
                           data=json.dumps({'username': 'new_user','password':'new_user','email':'new_user@new_user.com'}))        
        self.assertEquals(401,rv.status_code)
        user = User.query.filter_by(username='new_user').first()        
        self.assertEquals(user,None)
        
    @login_before_test(admin_user_name,admin_user_password)
    def test_POST_user_bad_email(self):                         
        rv = self.app.post('/user',    
                           data=json.dumps({'username':'new_user','password':'new_user','email':'new_user-new_user.com'}))        
        self.assertEquals(422,rv.status_code)
        user = User.query.filter_by(username='new_user').first()        
        self.assertEquals(user,None)
        
    @login_before_test(admin_user_name,admin_user_password)
    def test_POST_user_bad_username(self):                         
        username = 'boooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo'
        rv = self.app.post('/user',    
                           data=json.dumps({'username': username,'password':'new_user','email':'new_user@new_user.com'}))        
        self.assertEquals(422,rv.status_code)
        user = User.query.filter_by(username='new_user').first()        
        self.assertEquals(user,None)
    
    @login_before_test(admin_user_name,admin_user_password)
    def test_POST_user_null_email_username(self):                         
        rv = self.app.post('/user',    
                           data=json.dumps({}))        
        self.assertEquals(422,rv.status_code)
        user = User.query.filter_by(username='new_user').first()        
        self.assertEquals(user,None)

    @login_before_test(admin_user_name,admin_user_password)
    def test_POST_user_duplicate(self):                         
        rv = self.app.post('/user',    
                           data=json.dumps({'username': 'doesnotexist','password':'doesnotexist','email':'doesnotexist@doesnotexist.org'}))                
        rv = self.app.post('/user',    
                           data=json.dumps({'username': 'doesnotexist2','password':'doesnotexist','email':'doesnotexist@doesnotexist.org'}))        
        self.assertEquals(409,rv.status_code)
        rv = self.app.post('/user',    
                           data=json.dumps({'username': 'doesnotexist','password':'doesnotexist','email':'doesnotexist@doesnotexist.org2'}))                    
        self.assertEquals(409,rv.status_code)
        
    
    
    #unit test for app.make_json_error
    #unit test for user_dict    
    #make loading of flask-sqlalchemy a function, not an import    
    #fix seed_testing
            
if __name__ == '__main__':
    unittest.main()
