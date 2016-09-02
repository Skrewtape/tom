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
import argparse

parser = argparse.ArgumentParser(description='Initialize a TOM db with some test data.')
parser.add_argument('--numplayers', type=int, default=1, 
                    help='number of players to initialize db with (default: 5)')
parser.add_argument('--numentries', default=1, type=int,
                    help='number of full tickets to create per player(default:1)')

args = parser.parse_args()


def init_tournaments():
    machines=app.types.Machine.query.all()
    main = create_tournament('main', single_division=False)
    classics_1 = create_tournament('classics 1')
    classics_2 = create_tournament('classics 2')
    classics_3 = create_tournament('classics 3')
    herb = create_tournament('herb',scoring_type='herb')
    
    split_flipper = create_tournament('split flipper',team_tournament=True)    
    classics_all_1 = create_division('all',finals_num_games_per_match=1)
    classics_all_1.stripe_sku = "sku_8beHMnaBSdH4NA"
    classics_all_2 = create_division('all')
    classics_all_2.stripe_sku = "sku_8beHMnaBSdH4NA"    
    classics_all_3 = create_division('all')
    classics_all_3.stripe_sku = "sku_8beHMnaBSdH4NA"
    herb_all = create_division('herb_all', number_of_scores_per_entry=1, finals_player_selection_type="ppo",finals_num_players_per_group=2,finals_num_games_per_match=1)
    herb_all.stripe_sku = "sku_8zGvY92kgyMlx1"    
    split_flipper_all = create_division('splitflipper_all',1)
    split_flipper_all.stripe_sku = "sku_8cVf2tetzJ4f8D"
    main_a = create_division('A')
    main_a.stripe_sku = ""
    main_b = create_division('B')
    main_c = create_division('C')
    main_d = create_division('D')
    main_d.stripe_sku = "sku_8beJOPdNmnoQgw"
    main_c.stripe_sku = "sku_8beFqmlhh0y6Wa"
    main_b.stripe_sku = "sku_8bU4ZwvW1UMtxy"
    main_a.stripe_sku = "sku_8bY4j0VdBxGmPu"    

    add_machines_to_division(herb_all,machines[0:10])
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
    herb.divisions.append(herb_all)
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
        #player.gen_pin()
        DB.session.commit()        
        print " player %d is done \n" % play_num

def init_player_entries(num_entries, division,player=None,team=None):
    for i in range(num_entries):        
        create_entry_and_add_scores(division,player=player,team=team)
    DB.session.commit()            

def init_player_herb_entries(num_entries, division,player=None,team=None, division_machine_id=None):    
    for i in range(num_entries):        
        create_herb_entry(division,player=player,team=team,division_machine_id=division_machine_id)
    DB.session.commit()            

    
        
init_db()            
init_roles()
create_user('elizabeth','elizabeth',ALL_ROLES)
init_ipdb_machines()
init_tournaments()
single_divisions = app.types.Division.query.join(app.types.Tournament).filter_by(single_division=True,team_tournament=False,scoring_type="papa").all()
main_divisions = app.types.Division.query.join(app.types.Tournament).filter_by(single_division=False).all()
linked_division = main_divisions[0]
team_division = app.types.Division.query.join(app.types.Tournament).filter_by(single_division=True,team_tournament=True).first()
herb_division = app.types.Division.query.join(app.types.Tournament).filter_by(single_division=True,scoring_type="herb").first()
herb_machines = herb_division.machines[0:5]
create_metadivision("Classics",[single_divisions[0],single_divisions[1],single_divisions[2]])

init_players(linked_division,args.numplayers)
players=app.types.Player.query.order_by(app.types.Player.player_id).all()
player_entry_divisions=single_divisions
player_entry_divisions.append(linked_division)
for player in players:
    print " creating entry for player %d" % player.player_id    
    for division in player_entry_divisions:
        init_player_entries(args.numentries,division,player=player)
        
for player in players:
    for herb_machine in herb_machines:
        init_player_herb_entries(args.numentries,herb_division,player=player,division_machine_id=herb_machine.division_machine_id)

teams = app.types.Team.query.all()
for team in teams:
    init_player_entries(1,team_division,team=team)
    
