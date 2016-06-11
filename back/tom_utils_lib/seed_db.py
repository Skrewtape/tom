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

ALL_ROLES = ['admin', 'scorekeeper', 'desk']
division_machines = []
machines = []
tournaments = []
divisions = []

DB.reflect()
DB.drop_all()
DB.create_all()

def init_roles():
    for role_name in ALL_ROLES:
        role = app.types.Role(name=role_name)
        DB.session.add(role)
        ROLE_MAP[role_name] = role

def init_users():
#create users in db
    for info in [
            ['avi', 'finkel.org', ALL_ROLES],
            ['elizabeth', 'papa.org', ALL_ROLES],
            ['admin', 'papa.org', ['admin']],
            ['scorekeeper', 'papa.org', ['scorekeeper']],
            ['desk', 'papa.org', ['desk']],
    ]:
        user = app.types.User(
            username=info[0]#,
            #email=info[0] + '@' + info[1],
        )
        user.crypt_password(info[0])
        for role_name in info[2]:
            user.roles.append(ROLE_MAP[role_name])
        DB.session.add(user)

#create machines in db
def init_machines():
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
        if len(elems) == 4:
            machine.abbreviation = elems[3]
        machines.append(machine)
        DB.session.add(machine)
        DB.session.commit()        

def create_tournament(name, single_division=True, team_tournament=False):
    global tournaments
    tournament = app.types.Tournament(name=name)
    tournament.active = True
    tournament.single_division = single_division
    tournament.team_tournament = team_tournament
    tournaments.append(tournament)
    DB.session.add(tournament)
    return tournament

def create_division(name):
    global divisions
    division = app.types.Division(name=name)
    division.number_of_scores_per_entry=5
    divisions.append(division)
    DB.session.add(division)
    return division

def create_team(name, player_one):
    new_team = app.types.Team(
        team_name = name        
    )
    DB.session.add(new_team)    
    new_team.players.append(player_one);
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
    
def create_player(first_name,last_name):
    player = app.types.Player(first_name=first_name,last_name=last_name,search_name="%s%s" % (first_name,last_name))    
    DB.session.add(player)
    return player

def create_entry(division,active,completed,voided,num_scores_per_entry):
    entry = app.types.Entry(refresh=False,division=division,active=active,completed=completed,voided=voided,number_of_scores_per_entry=num_scores_per_entry)
    DB.session.add(entry)
    return entry

def init_tournaments():    
    main = create_tournament('main', False)
    classics_1 = create_tournament('classics 1')
    classics_2 = create_tournament('classics 2')
    classics_3 = create_tournament('classics 3')
    classics_all_1 = create_division('all')
    classics_all_2 = create_division('all')
    classics_all_3 = create_division('all')
    main_a = create_division('A')
    main_b = create_division('B')
    main_c = create_division('C')
    main_d = create_division('D')
    add_machines_to_division(classics_all_1,machines[0:10])
    add_machines_to_division(classics_all_2,machines[11:20])
    add_machines_to_division(classics_all_3,machines[21:30])
    add_machines_to_division(main_a,machines[31:40])
    add_machines_to_division(main_b,machines[41:50])
    add_machines_to_division(main_c,machines[51:60])
    add_machines_to_division(main_d,machines[61:70])
    main.divisions.append(main_a)
    main.divisions.append(main_b)
    main.divisions.append(main_c)
    main.divisions.append(main_d)
    classics_1.divisions.append(classics_all_1)
    classics_2.divisions.append(classics_all_2)
    classics_3.divisions.append(classics_all_3)
    DB.session.commit()
    
def add_scores_to_entry(division,player,active=True,num=5,void=False):
    entry = create_entry(division,False,True,False,5)
    for entry_num in range(num):                
        random_int = randint(0,10000)
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

    player.entries.append(entry)
    DB.session.commit()
    
# def add_scores_to_entry(division,player):
#     entry = create_entry(division,False,True,False,5)
#     for entry_num in range(5):                
#         random_int = randint(0,10000)
#         score = app.types.Score(machine_id=division.machines[entry_num].machine_id,score=random_int)
#         DB.session.add(score)
#         entry.scores.append(score)                
#     player.entries.append(entry)
#     DB.session.commit()
    
def init_players(division):
    #DB.reflect()
    #app.types.Score.__table__.drop(DB.engine)
    #app.types.Entry.__table__.drop(DB.engine)
    #app.types.Player.__table__.drop(DB.engine)
    #for player in app.types.Player.query.all():
    #    player.delete()
    #    DB.session.commit()
        
    for play_num in range(0,50):
        first_name = first_names[random.randrange(0,len(first_names))]
        last_name = first_names[random.randrange(0,len(first_names))]
        player = create_player(first_name,last_name)
        print " adding player %d " % play_num
        DB.session.add(player)
        create_team(player.first_name,player)
        DB.session.commit()
        for division in divisions:
            #division = divisions[0]
            #player.linked_division.append(division)
            for i in range(1):
                add_scores_to_entry(division,player,active=False)
        DB.session.commit()            
        print " player %d is done \n" % play_num
            
init_roles()
init_users()
init_machines()
#init_tournaments()
#init_players([x for x in divisions if x.division_id == 1][0])

