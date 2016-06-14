import os
import sys

max_num_concurrent_entries = 2
max_unstarted_tokens = 5
use_stripe = False
if 'USE_STRIPE' in os.environ:    
    use_stripe = True
player_login = False
if 'ALLOW_PLAYER_LOGIN' in os.environ:    
    player_login = True

    
