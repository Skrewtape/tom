#!./venv/bin/python
"""Set up DB tables and add some core data"""
#This is importing sqlAlchemy
import os
import sys
base_dir = os.path.dirname(__file__)
dir = base_dir+"../"
sys.path.append(dir)

from app import DB
import time

import app.types

from re import compile, UNICODE
import random

_strip_pattern = compile('[\W_]+', UNICODE)

from random import randint

#by importing app.types, the DB var now has all the table info

ALL_ROLES = ['admin', 'scorekeeper', 'desk', 'void']

default_users = [['avi', 'finkel.org', ALL_ROLES],
                 ['elizabeth', 'papa.org', ALL_ROLES],
                 ['admin', 'papa.org', ['admin']],
                 ['scorekeeper', 'papa.org', ['scorekeeper']],
                 ['desk', 'papa.org', ['desk']],
]    

def get_default_admin_username_password():
    return {'username':default_users[1][0],'password':default_users[1][0]}

def init_db():
    DB.reflect()
    DB.drop_all()
    DB.create_all()

def init_roles():
    for role_name in ALL_ROLES:
        role = app.types.Role(name=role_name)
        DB.session.add(role)        

def create_user(username,password,roles):
    user = app.types.User(
        username=username
    )
    user.crypt_password(password)
    for role_name in roles:
        role = app.types.Role.query.filter_by(name=role_name).first()
        user.roles.append(role)
    DB.session.add(user)
    DB.session.commit()

#create machines in db
def init_machines():
    for line in open('%s/machines.dat' % base_dir, mode='r'):
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
        if len(elems) == 4:
            machine.abbreviation = elems[3]
        DB.session.add(machine)
        DB.session.commit()        

def create_tournament(name, single_division=True, team_tournament=False, scoring_type="papa"):
    global tournaments
    tournament = app.types.Tournament(name=name)
    tournament.active = True
    tournament.single_division = single_division
    tournament.team_tournament = team_tournament
    tournament.scoring_type = scoring_type
    DB.session.add(tournament)
    return tournament

def create_division(name,number_of_scores_per_entry=5,stripe_sku=None,local_price=None):
    global divisions
    division = app.types.Division(name=name)
    division.number_of_scores_per_entry=number_of_scores_per_entry
    division.local_price = 5
    if stripe_sku:
        division.stripe_sku = stripe_sku
    if local_price:
        division.local_price=local_price
    DB.session.add(division)
    return division

def create_metadivision(name,divisions):
    global metadivisions
    metadivision = app.types.Metadivision(name=name)
    for division in divisions:
        metadivision.divisions.append(division)
    DB.session.add(metadivision)
    DB.session.commit()
    return metadivision

def create_team(name, player_one, player_two):
    new_team = app.types.Team(
        team_name = name        
    )    
    new_team.players.append(player_one);
    new_team.players.append(player_two);
    DB.session.add(new_team)    
    DB.session.commit()

    
    
def add_machines_to_division(division,machines):    
    for machine in machines:
        new_division_machine = app.types.DivisionMachine(
            machine_id = machine.machine_id,
            division_id = division.division_id
        )
        DB.session.add(new_division_machine)
        division.machines.append(new_division_machine)        
    DB.session.commit()
    
def create_player(first_name,last_name,on_team=False, asshole=False, email=None, division=None):
    player = app.types.Player(first_name=first_name,last_name=last_name,search_name="%s%s" % (first_name,last_name))
    if asshole:
        player.player_is_an_asshole_count=3
    if email:
        player.email = email
    if division:
        player.linked_division.append(division)
    DB.session.add(player)
    DB.session.commit()
    if on_team and player.player_id % 2 == 0:
        player_two = app.types.Player.query.filter_by(player_id=player.player_id-1).first()
        create_team("Team %d" % player.player_id,player,player_two)
    
    return player

def create_entry(division,active,completed,voided,num_scores_per_entry):
    entry = app.types.Entry(refresh=False,division=division,active=active,completed=completed,voided=voided,number_of_scores_per_entry=num_scores_per_entry)
    DB.session.add(entry)
    return entry

        
def create_entry_and_add_scores(division,active=False,num=5,void=False, team=None, player=None):
    entry = create_entry(division,False,True,False,5)        
    
    for entry_num in range(num):                
        random_int = randint(0,100000000) - randint(0,510252)        
        score = app.types.Score(division_machine_id=division.machines[entry_num].division_machine_id,score=random_int)
        DB.session.add(score)
        entry.scores.append(score)
    if num==5:
        entry.completed = True
        entry.active=False
    else:       
        entry.completed = False
        entry.active=active
    entry.voided = void
    if player:
        player.entries.append(entry)
    if team:
        team.entries.append(entry)
    DB.session.commit()

def create_herb_entry(division,active=False,void=False,team=None,player=None,division_machine_id=None):
    entry = create_entry(division,False,True,False,1)        
        
    random_int = randint(0,100000000) - randint(0,510252)        
    score = app.types.Score(division_machine_id=division_machine_id,score=random_int)
    DB.session.add(score)
    entry.scores.append(score)
    entry.completed = True
    entry.active=False
    entry.voided = void
    if player:
        player.entries.append(entry)
    if team:
        team.entries.append(entry)
    DB.session.commit()
    

    

