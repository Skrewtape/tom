from splinter import Browser
import os
import sys
import time
dir = os.path.dirname(__file__)
dir = dir+"../.."
sys.path.append(dir)
import unittest
import tempfile
import inspect
from tom_utils_lib.seed_db import *

class TomIntegrationTestCase(unittest.TestCase):        
    def setUp(self):
        init_db()
        init_roles()
        init_users()
        self.tom_url_base='http://localhost/dist'
        self.tom_results_url_base='http://192.168.1.178:8000/results'
        self.admin_user = get_default_admin_username_password()
        self.browser = Browser('phantomjs')
        
    def find_element_by_partial_text(browser,element_type,partial_text):
        return browser.find_by_xpath('//%s[contains(normalize-space(.), "%s")]' % (element_type,partial_text))

    def open_menu(self):
        button = self.browser.find_by_id('menu_icon')                
        button.click()
        time.sleep(1)        
    
    def login_to_TOM(self,user_name,password):
        self.browser.driver.set_window_size(1400,1000)
        self.open_menu()
        button = self.browser.find_by_id('sidebar-login-link')        
        button.click()
        time.sleep(1)
        input_username = self.browser.find_by_name('username')                
        input_username.fill('elizabeth')        
        input_password = self.browser.find_by_name('password')                
        input_password.fill('elizabeth')                
        button = self.browser.find_by_id('login_button')                
        button.click()
        time.sleep(2)
        
        
