from splinter import Browser
import tomintegrationtestbase

class TestSmoke(tomintegrationtestbase.TomIntegrationTestCase):

    def setUp(self):
        super(TestSmoke,self).setUp()
        
    def test_smoke_frontend(self):
        with Browser('phantomjs') as browser:            
            browser.visit(self.tom_url_base)
            assert browser.is_text_present('TOM')

    def test_smoke_backend(self):
        with Browser('phantomjs') as browser:            
            browser.visit("%s/index" % self.tom_results_url_base)
            assert browser.is_text_present('TOM')
            
            
