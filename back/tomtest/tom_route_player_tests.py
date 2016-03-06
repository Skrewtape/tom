import os
import tomtestbase
from tomtestbase import TomTestCase
from app import App
import unittest
import tempfile
from app.types import Player, Division
from app import DB
from tomtestbase import admin_user_name, admin_user_password, all_roles_user_name, all_roles_user_password,non_admin_user_name, non_admin_user_password, non_existant_user, non_existant_user_password
from tomtestbase import login_before_test
from flask import json, Response


class TestRoutePlayer(tomtestbase.TomTestCase):

    @login_before_test(admin_user_name,admin_user_password)
    def test_PUT_player_with_logged_in_user(self):        
        player = Player(first_name="test_first",
                        last_name="test_last")                        
        DB.session.add(player)
        DB.session.commit()        
        rv = self.app.put('/player/%d' % player.player_id,
                           data=json.dumps({'first_name':'test_firstname','last_name':'test_lastname','email':'new_user@new_user.com','linked_division':'1'}))
        edited_player = json.loads(rv.data)                        
        

    @login_before_test(admin_user_name,admin_user_password)
    def test_PUT_player_mulitple_linked_division_with_logged_in_user(self):        
        player = Player(first_name="test_first",
                        last_name="test_last")                        
        linked_division_1 = Division.query.filter_by(division_id=2).first()
        linked_division_2 = Division.query.filter_by(division_id=10).first()
        player.linked_division.append(linked_division_1)
        player.linked_division.append(linked_division_2)        
        DB.session.add(player)
        DB.session.commit()        

        rv = self.app.put('/player/%d' % player.player_id,
                           data=json.dumps({'first_name':'test_firstname','last_name':'test_lastname','email':'new_user@new_user.com','linked_division':'1'}))        
        edited_player = json.loads(rv.data)                                
        self.assertEquals(rv.status_code,200,'Was expecting status code 200, but it was %s' % (rv.status_code))
        self.assertDictContainsSubset({'linked_division': [{'division_id': 10,
                                                            'name': 'B',
                                                            'tournament_id': 2},
                                                           {'division_id': 1,
                                                            'name': 'A',
                                                            'tournament_id': 1}]},
                                      edited_player,
                                      'Did not find all the user fields expected in to_dict() output')

    @login_before_test(admin_user_name,admin_user_password)
    def test_PUT_player_invalid_linked_division_with_logged_in_user(self):        
        player = Player(first_name="test_first",
                        last_name="test_last")                        
        linked_division_1 = Division.query.filter_by(division_id=1).first()
        player.linked_division.append(linked_division_1)        
        DB.session.add(player)
        DB.session.commit()        

        rv = self.app.put('/player/%d' % player.player_id,
                           data=json.dumps({'first_name':'test_firstname','last_name':'test_lastname','email':'new_user@new_user.com','linked_division':'2'}))        
        edited_player = json.loads(rv.data)                                
        self.assertEquals(rv.status_code,409,'Was expecting status code 409, but it was %s' % (rv.status_code))
        
    @login_before_test(admin_user_name,admin_user_password)
    def test_POST_player_with_logged_in_user(self):        
        rv = self.app.post('/player',
                           data=json.dumps({'first_name':'test_firstname','last_name':'test_lastname','email':'new_user@new_user.com'}))
        new_player = json.loads(rv.data)                        
        self.assertEquals(rv.status_code,200,'Was expecting status code 200, but it was %s' % (rv.status_code))
        self.assertDictContainsSubset({'first_name':'test_firstname',
                                       'last_name':'test_lastname',
                                       'search_name':'test_firstnametest_lastname',
                                       'email':'new_user@new_user.com',
                                       'machine_id':None},
                                       new_player,
                                       'Did not find all the user fields expected in to_dict() output')

    @login_before_test(admin_user_name,admin_user_password)
    def test_POST_player_no_email_with_logged_in_user(self):        
        rv = self.app.post('/player',
                           data=json.dumps({'first_name':'test_firstname','last_name':'test_lastname'}))
        new_player = json.loads(rv.data)                        
        self.assertEquals(rv.status_code,200,'Was expecting status code 200, but it was %s' % (rv.status_code))
        self.assertDictContainsSubset({'first_name':'test_firstname',
                                       'last_name':'test_lastname',
                                       'search_name':'test_firstnametest_lastname',
                                       'email':None,
                                       'machine_id':None},
                                       new_player,
                                       'Did not find all the user fields expected in to_dict() output')
        
    
    @login_before_test(admin_user_name,admin_user_password)
    def test_GET_player_with_logged_in_user(self):
        for player_index in range(5):
            player = Player(first_name="test%d" % player_index,
                            last_name="lastname%d" % player_index)                        
            DB.session.add(player)
            DB.session.commit()
        
        rv = self.app.get('/player')
        returned_players = json.loads(rv.data)        
        self.assertIn('players',returned_players,'No players were returned, but players were expected')
        self.assertEquals(rv.status_code,200,'Was expecting status code 200, but it was %s' % (rv.status_code))
        self.assertEquals(len(returned_players['players']),5,'Expecting 5 results,got %s' % (len(returned_players['players'])))

    
    def test_GET_player_without_logged_in_user(self):
        for player_index in range(5):
            player = Player(first_name="test%d" % player_index,
                            last_name="lastname%d" % player_index)                        
            DB.session.add(player)
            DB.session.commit()
        
        rv = self.app.get('/player')
        returned_players = json.loads(rv.data)        
        self.assertNotIn('players',returned_players,'Players were returned, but players were not expected')
        self.assertEquals(rv.status_code,401,'Was expecting status code 401, but it was %s' % (rv.status_code))
        
        
        
            
if __name__ == '__main__':
    unittest.main()
