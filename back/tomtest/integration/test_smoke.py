from splinter import Browser
import tomintegrationtestbase
import time

class TestSmoke(tomintegrationtestbase.TomIntegrationTestCase):

    def setUp(self):
        super(TestSmoke,self).setUp()
        
    def test_smoke_frontend(self):        
        self.browser.visit(self.tom_url_base)
        assert self.browser.is_text_present('TOM')

    def test_smoke_backend(self):        
        self.browser.visit("%s/index" % self.tom_results_url_base)
        assert self.browser.is_text_present('TOM')

    def test_login(self):
        self.browser.visit(self.tom_url_base)             
        self.login_to_TOM(self.admin_user['username'],self.admin_user['password'])                          
        self.open_menu()
        assert self.browser.is_text_present(self.admin_user['username'])

    def test_logout(self):        
        self.browser.visit(self.tom_url_base)             
        self.login_to_TOM(self.admin_user['username'],self.admin_user['password'])                          
        self.open_menu()
        self.browser.click_link_by_partial_text(self.admin_user['username'])
        time.sleep(2)            
        self.assertFalse(self.browser.is_text_present(self.admin_user['username'])) 

             
