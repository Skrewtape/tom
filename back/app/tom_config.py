import os
import sys

scores_per_entry = 5
max_num_concurrent_entries = 2
max_unstarted_tokens = 5
use_stripe = True

if 'ALLOW_PLAYER_LOGIN' in os.environ:    
    player_login = True
else:
    player_login = False
