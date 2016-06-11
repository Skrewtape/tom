#from base_case import admin_user_name, all_roles_user_name, non_admin_user_name, non_existant_user
#from base_case import admin_user_password, all_roles_user_password, non_admin_user_password, non_existant_user_password

import os
import sys
import tomtestbase
from app.types import Player
from app import auth, DB
import unittest

class TestModelPlayer(tomtestbase.TomTestCase):
        
    def test_to_dict_simple_with_no_entries_and_no_email(self):
        player = Player(first_name='aiton',last_name='goldman')
        
        DB.session.add(player)
        DB.session.commit()
        player = Player.query.filter_by(first_name='aiton',last_name='goldman').first()
        simple_player_dict_len = len(player.to_dict_simple().keys())        
        self.assertEqual(6,simple_player_dict_len)        
        self.assertDictContainsSubset({'first_name':'aiton',
                                       'last_name':'goldman',
                                       'search_name':None,
                                       'email':None,
                                       'machine_id':None},
                                       player.to_dict_simple(),
                                       'Did not find all the user fields expected in to_dict() output')

    def test_to_dict_simple_with_email_and_no_entries(self):
        player = Player(first_name='aiton',last_name='goldman',email='aiton@aiton.com')
        
        DB.session.add(player)
        DB.session.commit()
        player = Player.query.filter_by(first_name='aiton',last_name='goldman').first()
        simple_player_dict_len = len(player.to_dict_simple().keys())        
        self.assertEqual(6,simple_player_dict_len)        
        self.assertDictContainsSubset({'first_name':'aiton',
                                       'last_name':'goldman',
                                       'search_name':None,
                                       'email':'aiton@aiton.com',
                                       'machine_id':None},
                                       player.to_dict_simple(),
                                       'Did not find all the user fields expected in to_dict() output')
        
        
if __name__ == '__main__':
    unittest.main()
