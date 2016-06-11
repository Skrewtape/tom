import os
import sys
base_dir = os.path.dirname(__file__)
dir = base_dir+"../"
sys.path.append(dir)

from seed_db import *
from first_names import first_names
import app
from app import DB
import random

def init_users():
#create users in db

   default_users = [['avi', 'finkel.org', ALL_ROLES],
                    ['elizabeth', 'papa.org', ALL_ROLES],
                    ['admin', 'papa.org', ['admin']],
                    ['scorekeeper', 'papa.org', ['scorekeeper']],
                    ['desk', 'papa.org', ['desk']],
   ]    
   for user in default_users:
       create_user(user[0],user[0],user[2]) 


init_db()            
init_roles()
init_users()
init_machines()
