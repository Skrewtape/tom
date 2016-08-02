from splinter import Browser
import tomintegrationtestbase
import time
import unittest

class TestSmoke(tomintegrationtestbase.TomIntegrationTestCase):

    def setUp(self):
        super(TestSmoke,self).setUp()

    @unittest.skip("demonstrating skipping")        
    def test_smoke_frontend(self):        
        self.browser.visit(self.tom_url_base)
        assert self.browser.is_text_present('TOM')

    @unittest.skip("demonstrating skipping")    
    def test_smoke_backend(self):        
        self.browser.visit("%s/index" % self.tom_results_url_base)
        assert self.browser.is_text_present('TOM')

    def test_login(self):
        self.browser.visit(self.tom_url_base)             
        self.login_to_TOM(self.admin_user['username'],self.admin_user['password'])                          
        self.open_menu()
        assert self.browser.is_text_present(self.admin_user['username'])        
        assert len(self.browser.find_by_id('error_has_happened'))==0        

    @unittest.skip("demonstrating skipping")
    def test_login_negative(self):
        self.browser.visit(self.tom_url_base)             
        self.login_to_TOM('fuck','yeah')
        time.sleep(3)
        #self.open_menu()
        #assert self.browser.is_text_present(self.admin_user['username'])
        self.browser.screenshot('/tmp/out.png')        
        assert len(self.browser.find_by_id('error_has_happened'))==1        
        
        
    @unittest.skip("demonstrating skipping")        
    def test_logout(self):        
        self.browser.visit(self.tom_url_base)             
        self.login_to_TOM(self.admin_user['username'],self.admin_user['password'])                          
        self.open_menu()
        self.browser.click_link_by_partial_text(self.admin_user['username'])
        time.sleep(2)            
        self.assertFalse(self.browser.is_text_present(self.admin_user['username'])) 

             
