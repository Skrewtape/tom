#!/usr/bin/env python
import os
import sys
base_dir = os.path.dirname(__file__)
dir = base_dir+"../"
sys.path.append(dir)

from tom_utils_lib.seed_db import *
from tom_utils_lib.first_names import first_names
import app
from app import DB
import random


def init_tournaments():
    machines=app.types.Machine.query.all()
    main = create_tournament('main', False)
    classics_1 = create_tournament('classics 1')
    classics_2 = create_tournament('classics 2')
    classics_3 = create_tournament('classics 3')
    split_flipper = create_tournament('split flipper',team_tournament=True)    
    classics_all_1 = create_division('all')
    classics_all_2 = create_division('all')
    classics_all_3 = create_division('all')
    split_flipper_all = create_division('splitflipper_all',1)
    main_a = create_division('A')
    main_b = create_division('B')
    main_c = create_division('C')
    main_d = create_division('D')
    add_machines_to_division(classics_all_1,machines[0:10])
    
    add_machines_to_division(classics_all_2,machines[11:20])
    add_machines_to_division(classics_all_3,machines[21:30])
    add_machines_to_division(split_flipper_all,machines[31:40])    
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
    split_flipper.divisions.append(split_flipper_all)
    DB.session.commit()

def init_players(division, num_players):        
    for play_num in range(0,num_players):
        first_name = first_names[random.randrange(0,len(first_names))]
        last_name = first_names[random.randrange(0,len(first_names))]
        player = create_player(first_name,last_name,on_team=True,division=division)
        print " adding player %d " % play_num
        DB.session.add(player)        
        DB.session.commit()
        print " player %d is done \n" % play_num

def init_player_entries(num_entries, division,player=None,team=None):
    for i in range(num_entries):
        create_entry_and_add_scores(division,player=player,team=team)
    DB.session.commit()            

        
init_db()            
init_roles()
init_users()
init_machines()
init_tournaments()
single_divisions = app.types.Division.query.join(app.types.Tournament).filter_by(single_division=True,team_tournament=False).all()
main_divisions = app.types.Division.query.join(app.types.Tournament).filter_by(single_division=False).all()
linked_division = main_divisions[0]
team_division = app.types.Division.query.join(app.types.Tournament).filter_by(single_division=True,team_tournament=True).first()
create_metadivision("Classics",[single_divisions[0],single_divisions[1],single_divisions[2]])

init_players(linked_division,3)
players=app.types.Player.query.order_by(app.types.Player.player_id).all()
player_entry_divisions=single_divisions
player_entry_divisions.append(linked_division)
for player in players:
    for division in player_entry_divisions:
        init_player_entries(1,division,player=player)
teams = app.types.Team.query.all()
for team in teams:
    init_player_entries(1,team_division,team=team)
    
