#!./venv/bin/python
"""Set up DB tables and add some core data"""
#This is importing sqlAlchemy
from app import DB

import app.types

from re import compile, UNICODE

from sqlalchemy.exc import ArgumentError,InvalidRequestError,IntegrityError

_strip_pattern = compile('[\W_]+', UNICODE)

#by importing app.types, the DB var now has all the table info

def init_db():
    DB.drop_all()
    DB.create_all()

    ROLE_MAP = {}

    ALL_ROLES = ['admin', 'scorekeeper']

    for role_name in ALL_ROLES:
        role = app.types.Role(name=role_name)
        DB.session.add(role)
        ROLE_MAP[role_name] = role

    tournament = app.types.Tournament(name='aitons_tourney', active=True)
    tournament2 = app.types.Tournament(name='aitons_new_tourney', active=True)
    DB.session.add(tournament)
    DB.session.add(tournament2)    
    DB.session.commit()
    x=1
    for division_name in ['A','BB','C','DD','E','Classics','Extra1','Extra2']:
        division = app.types.Division(name=division_name,
                                      tournament_id=1
        )
        division.machines.append(app.types.Machine(name='TEST_MACHINE_%d' % (x),year='1976'))
        x = x + 5
        DB.session.add(division)
        DB.session.commit()
    for division_name in ['AA','B','CC','D','EE','Classics','Extra1','Extra2']:
        division = app.types.Division(name=division_name,
                                      tournament_id=2
        )
        division.machines.append(app.types.Machine(name='TEST_MACHINE_%d' % (x),year='1976'))
        x = x + 5
        DB.session.add(division)
        DB.session.commit()
        
    #create users in db
    for info in [    
        ['avi', 'finkel.org', ALL_ROLES],
        ['elizabeth', 'papa.org', ALL_ROLES],
        ['admin', 'papa.org', ['admin']],
        ['scorekeeper', 'papa.org', ['scorekeeper']],
    ]:
        
        user = app.types.User(
            username=info[0],
            email=info[0] + '@' + info[1]
        )            
        user.crypt_password(info[0])            
        for role_name in info[2]:
            user.roles.append(ROLE_MAP[role_name])
        DB.session.add(user)
        DB.session.commit()
            
    for line in open('machines.dat', mode='r'):
        elems = line.split('|')
        manufacturer = app.types.Manufacturer.query.filter_by(name=elems[1]).first()
        if manufacturer is None:
            manufacturer = app.types.Manufacturer(
                name=elems[1]
            )
            DB.session.add(manufacturer)

        machine = app.types.Machine(
            name=elems[0],
            search_name=_strip_pattern.sub("", elems[0].lower()),
            manufacturer=manufacturer,
            year=elems[2]
        )
        DB.session.add(machine)
    DB.session.commit()
