#!/usr/bin/env python
import os
import sys
base_dir = os.path.dirname(__file__)
dir = base_dir+"../"
sys.path.append(dir)

from tom_utils_lib.seed_db import *
import app
from app import DB
import random

import argparse

parser = argparse.ArgumentParser(description='Initialize a TOM db and specify initial users.')
parser.add_argument('--admin_username', type=str, 
                    help='admin user name', required=True)
parser.add_argument('--admin_password', type=str, 
                    help='admin password', required=True)
parser.add_argument('--deskworker_username', type=str, 
                    help='deskworker user name')
parser.add_argument('--deskworker_password', type=str, 
                    help='deskworker password')
parser.add_argument('--scorekeeper_username', type=str, 
                    help='scorekeeper username')
parser.add_argument('--scorekeeper_password', type=str, 
                    help='scorekeeper password')

args = parser.parse_args()


def init_users():
#create users in db
   create_user(args.admin_username,args.admin_password,ALL_ROLES)
   if args.scorekeeper_username:
      create_user(args.scorekeeper_username,args.scorekeeper_password,['scorekeeper'])
   if args.deskworker_username:
      create_user(args.deskworker_username,args.deskworker_password,['desk'])

print "initializing db"
init_db()            
print "initializing roles"
init_roles()
print "initializing users"
init_users()
print "initializing machines"
init_ipdb_machines()
print "all done!"
