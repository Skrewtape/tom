#!./venv/bin/python
"""Set up DB tables and add some core data"""
#This is importing sqlAlchemy
from app import DB

import app.types

from re import compile, UNICODE
import random

from first_names import first_names

_strip_pattern = compile('[\W_]+', UNICODE)

from random import randint

#by importing app.types, the DB var now has all the table info

ROLE_MAP = {}

ALL_ROLES = ['admin', 'scorekeeper', 'desk', 'pooper','void']
machines = []
tournaments = []
divisions = []

DB.reflect()
DB.drop_all()
DB.session.commit()
