#!./venv/bin/python
"""Set up DB tables and add some core data"""
from app import DB

import app.types

DB.drop_all()
DB.create_all()

ROLE_MAP = {}

ALL_ROLES = ['admin', 'scorekeeper']

for role_name in ALL_ROLES:
    role = app.types.Role(name=role_name)
    DB.session.add(role)
    ROLE_MAP[role_name] = role

for info in [
    ['avi', 'finkel.org', ALL_ROLES],
    ['elizabeth', 'papa.org', ALL_ROLES],
    ['admin', 'papa.org', ['admin']],
    ['scorekeeper', 'papa.org', ['scorekeeper']],
]:
    user = app.types.User(
        username=info[0],
        email=info[0] + '@' + info[1],
    )
    user.crypt_password(info[0])
    for role_name in info[2]:
        user.roles.append(ROLE_MAP[role_name])
    DB.session.add(user)

DB.session.commit()
