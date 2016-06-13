#Config Files

There are 2 config files that TOM uses - note that you will have to create secret_config.py:
```
back/app/tom_config.py
back/app/secret_config.py
```

Changes to the config files require a restart of TOM to be picked up

## Values in tom_config.py (with their default values)

```
max_unstarted_tokens = 5
```
This is the maximum number of unstarted tickets that a player can have.  This includes active/currently being played tickets. 

```
use_stripe = False
```
If this is set to true, when you create a new tournament you will be asked to enter a stripe product SKU for this tournament.  If this is set to false, when you create a new tournament you will be asked to enter the cost of a ticket for the tournament.  

```
player_login = False
```
If this is set to False, then only users will be allowed to login.
If this is set to True, then only players will be allowed to login (note : players will only have access to the "purchase tickets" links)
Note that if you set the environment variable ALLOW_PLAYER_LOGIN to any value, TOM will automatically set player_login to True on startup

## Values in secret_config.py 

PAY ATTENTION!!  secret_config.py has values THAT ARE SECRET.  It is important that they not be accessible to the general public, and DO NOT CHECK THEM INTO GIT!
```
strip_api_key = ""
```
This is your stripe api key that TOM will use for making API calls to stripe

```
app_secret_key = ""
```
This is the key that flask will use to encrypt your flask session information (i.e. if you are logged in or not).  Please see the flask quickstart guide for more details on generating this key - specifially the section on [generating secret keys](http://flask.pocoo.org/docs/0.11/quickstart/).

