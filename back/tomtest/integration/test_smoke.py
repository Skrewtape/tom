from splinter import Browser
import tomintegrationtestbase

class TestSmoke(tomintegrationtestbase.TomIntegrationTestCase):

    def setUp(self):
        super(TestSmoke,self).setUp()
        
    def test_smoke(self):
        with Browser('phantomjs') as browser:
            url = "http://localhost/dist"
            browser.visit(url)
            #browser.fill('q', 'unique')
            # Find and click the 'search' button    
            #button = browser.find_by_value('Google Search')
            # Interact with elements    
            #button.click()
            assert browser.is_text_present('TOM')
    
