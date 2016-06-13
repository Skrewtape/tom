import os
import sys

max_num_concurrent_entries = 2
max_unstarted_tokens = 5
use_stripe = False
player_login = False
if 'ALLOW_PLAYER_LOGIN' in os.environ:    
    player_login = True
    
