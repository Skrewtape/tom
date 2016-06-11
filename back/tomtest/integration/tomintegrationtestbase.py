import os
import sys
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
        
