#Overview
Welcome to the exciting world of adding features to/fixing bugs in TOM!  This document will cover the following subjects :

* Things you'll need to know before you start working on TOM
* TOM architecture overview 
* Details of TOM components
* How to get started with helping out

If you have any questions/comments/shower thoughts, there is a [slack](http://slack.com) instance where you can do this!  Our slack instance is called [tom-dev](https://tom-dev.slack.com/messages/general/) - send email to yanetut@gmail.com so you can get an invite and try it out!  

Good luck!  

#TOM Architecture
TOM consists of two parts : a backend and a frontend.  The backend is a "REST" api (written in python using the [flask framework](http://flask.pocoo.org/)) with a postgress database behind it.  The backend is launched by [gunicorn](http://docs.gunicorn.org/en/stable/index.html).  The frontend is an [AngularJS](https://angularjs.org/) web app.  Note that REST is in quotes - I tried to follow the rules of a REST interface, but sometimes got a little lazy.      

#Backend : Before you start
TOM uses the [flask framework](http://flask.pocoo.org/docs/0.11/) to implement it's REST api.  Please run through the quickstart guide in the flask docs.

In addition to the framework, TOM uses the following flask extensions
* [flask-sqlalchemy](http://flask-sqlalchemy.pocoo.org/2.1/)
* [flask-principal](http://pythonhosted.org/Flask-Principal/)
* [flask-login](http://flask-login.readthedocs.io/en/latest/)

Please follow the above links and read the docs on each of these extensions.  

Note that the flask-sqlalchemy extension uses [sqlalchemey](http://docs.sqlalchemy.org/en/latest/).  

TOM uses a postgresql database to store all it's info.  If you are not familiar with postgresql, please go through the [tutorial](https://www.postgresql.org/docs/9.5/static/index.html).  

If you have any questions (especially if you are not familiar with sqlalchmey or postgresql) please use the [tom-dev slack instance](https://tom-dev.slack.com/messages/general/) for help.   

#Backend : What's Where?

This is what the top level backend directory looks like

```
back/app
```
This is the top level directory of the flask application

```
back/app/__init__.py
```
This is where the flask application initialization and startup happens.  Starting a connection with the database, defining user permissions, defining error handlers, etc

```
back/app/auth.py
```
This contains callbacks called by the flask-login and flask-principal - see the links above for their documentation and explanation of how login and user permissions work.

```
back/app/routes
```
This directory contains all the files that define the flask routes

```
back/app/templates
```
The results pages are rendered by TOM.  This directory contains Jinja2 templates used for the results pages.

```
back/app/static
```
This is where static files live.  Why do we need to serve static files, and not just let apache serve these?  Because of cross site scripting restrictions in browsers.   When the results pages are rendered, the css and javascript files they include must come from the same host AND port as the html.  This will eventually go away (i.e. when nginex is an official part of the setup)    

```
back/app/tom_config.py
```
This is where we put options that are configurable at runtime (i.e. number of max allowed unstarted tickets, etc) 

```
back/app/types
```
This is where the sqlalchemy objects are defined.  

```
back/env.sample
```
a sample file that shows the two things you need to do before running the backend (i.e. set the DATABASE_URL env var, and make sure you are using the virtualenv python installation)

```
back/setup.py
```
The setup.py which will configure and install all the python dependencies

```
back/requirements.txt
```
The list of pip packages that should be installed when setup.py is run

```
back/tomtest
```
This is where all the unit tests live.  See section on unit tests for more details

```
back/utils
```
Utilities and helpers

#Backend : Getting Started
Follow the instructions in the [INSTALL_INSTRUCTIONS.md](INSTALL_INSTRUCTIONS.md).  Once you are done, open up 2 new terminal windows.  In the first one, run the following comman
```
./node_modules/grunt-cli/bin/grunt --backend_ip=<ip address of backend machine> watch

```

This will setup a watcher - while it is running, any files changed under front/src will cause grunt to be rerun.  

In the second terminal window, run the following commands :
```
cd back
export PYTHONPATH=`pwd`
./util/gunicorn.cmd
```

This will start the backend - while it is running, any files changed under back/app will cause gunicorn to restart the backend.  

#Backend : Database tables

Database tables are represented with [flask-sqlalchemy](http://flask-sqlalchemy.pocoo.org/2.1/).  Below is a summary of the table relationships - see the individual sqlalchemy classes for details on each class.

Tournaments have one Division (i.e. Classics) or multiple Divisions (i.e. Main).  In the case of Tournaments with multiple Divisions, Players must be linked to one of those Divisions and can only play in that Division.  Each Division has a list of DivisionMachines associated with it.  Each DivisionMachine represents a specific machine in a specific division.  Each DivisionMachine links to a Machine - Machines represent a list of unique machines - DivisionMachines make it possible for two seperate divisions to have the same machine type (i.e. we can have a TZ in Main A and Main D).

A ticket is represented by an Entry - each Entry has a number of Scores associated with it - the number of Scores is determined by the configuration of the Division.  Each Score is linked with a DivisionMachine and has a machine score.  When a Player goes to buy a ticket for a Tournament, a Token is created for that player and linked to the appropriate Division.  When a Player goes to play the first game on an Entry, TOM creates a new Enty if a Token for that player and Division is available and destroys the Token.

Metadivisions allow players to buy a single Token that is good for multiple Divisions - a Metadivision is linked to multiple Divisions, so buying a Token for a Metadivision means that token is good for the linked Divisions (i.e. a Classics Metadivision token is good for Classics 1, Classics 2, Classics 3). 

A Team of Players can be created.  Tournaments can be configured as team Tournaments.  When a Player on a Team buys a Token for a team Tournament, that Token is associated with all players on a Team.

A User is someone who needs to login to TOM (i.e. scorekeepers, admin, desk worker, etc).

A Finals is associated with a specific division (i.e. Classics single division is associated with a Finals) - it represents the Finals for a specific division.  Each Finals is associated with a series of FinalsMatches - each FinalsMatch represents a round for a group of players.  Each FinalsMatch is associated with a list of FinalsPlayers - a new set of FinalsPlayer is created for each Match - each FinalsPlayer represents a player in a specific FinalsMatch.  Each FinalsPlayer is linked to a Player.  For each FinalsPlayer, there is a list of FinalsScore - a FinalsScore records the score on a specific machine in a round.   

#Backend : Ranking

You'll notice that rankings are not stored in the database.  This is because calculate all rankings on the fly.  It turns out that calculating ranks on demand for specific divisions, machines, or players produces better results (in terms of performance) than calculating ranks on a regular basis for everything and recording it in the DB.  This is because :
* The number of people who will be trying to view rankings at any given time will not be that high (i.e. no more than 30-40 in the same second).
* When people look at rankings, they will be looking at a subset (i.e. a single division, a single machine, a single player).
* Write operations are far more expensive than query operations.

The downside is that we get this great performance through extremely ugly sql queries.  These queries have been documented in thier files (in back/app/routes/results.py and back/app/routes/finals.py) - please review the comments if you want to see how the queries work.

#Backend : Routes

**Organization of routes :**

Originally, routes were organized based on the sqlalchemy object they interacted with (i.e. routes that interacted with the Player class when in player.py).  Unfortunately, this strategy didn't scale well, and it got messy.  There is a issue opened to refactor the routes so that the file names are based on the head of the routes (i.e. /person, /entry, /score, etc).  

**Permissions/Security :**

Most of TOM's flask routes require a user to be logged in to use - [flask-login](http://flask-login.readthedocs.io/en/latest/) takes care of logging in a user, preserving their login info in the flask session, and logging out.  The @login_required decorator is used on routes which are only accessible to a logged in user.    

Once a user is logged in, we use [flask-principal](http://pythonhosted.org/Flask-Principal/) to control access for the different users.  Short story : each user has one or more roles (i.e. desk worker, admin, scorekeeper) associated with them in the database.   Those roles are used to define a Permission class (which is provided by flask-principal) and defines a set of roles that are needed in order to do something.  When appropriate, the flask routes in TOM are wrapped with the Permission - if the logged in user does not have the roles defined by the permission, then the route fails and returns a 403 status code to the client.  For example, the Void_Permission.require() decorater wraps the /void/ticket route, and prevents users without the Voider role to access the /void/ticket route.

Permissions are defined in the app/__init__.py file.

**Throwing Exceptions :**

If you encounter a problem inside of a route, the prefered way to stop route processing is to throw an exception.  Flask provides a number of exceptions - the two most popular are Conflict and BadRequest - these will stop route processing, and return the appropriate HTTP return code.  The AngularJS app will intercept these (based on the non 200 return code), display an appropriate error (based on the contents of the response which were filled in by the exception), and then return the AngularJS app to the home page

Note the ImATeapot excepetion is different - the AngularJS app will display an error (based on the contents of the exception), but it will not forward the AngularJS app to the home page - instead it will use one of the fields in the response (set by the ImATeapot exception) to determine where to forward the app.  Search for i_am_a_teapot to see examples of this.  


**FetchEntity :**

FetchEntity is a decorator function in back/app/routes/util.py.  It's purpose is to take url param of the format <entity>_id (i.e. player_id), and then use that variable (which has the id for that entity) to lookup the requested entity (i.e. use player_id to lookup and return the Player with player_id) and pass it along to the route function.  If the <entity>_id can not be looked up, it throws an exception. 


