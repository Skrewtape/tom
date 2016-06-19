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
This directory contains all the files that define the flask routes.  NOTE : this is in the process of being replaced with back/app/routes/v1

```
back/app/routes/v1
```
This directory WILL contain all the files that define the flask routes.  NOTE : this is in the process of replacing back/app/routes.  Please add any new routes to this directory.


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
back/app/secret_config.py
```
This is where we put secret options that are configurable at runtime (i.e. api key for stripe, etc) 


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
back/tom_utils_bin
```
Utilities and helpers

```
back/tom_utils_lib
```
Contains code used by utils in back/tom_utils_bin


#Backend : Getting Started
Follow the instructions in the [INSTALL_INSTRUCTIONS.md](INSTALL_INSTRUCTIONS.md).  Once you are done, open up a new shell and run the following command
```
cd back
env PYTHONPATH=`pwd` ./tom_util_bin/gunicorn.cmd
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

You'll notice that rankings are not stored in the database.  This is because we calculate all rankings on the fly.  It turns out that calculating ranks on demand for specific divisions, machines, or players produces better results (in terms of performance) than calculating ranks on a regular basis for everything and recording it in the DB.  This is because :
* The number of people who will be trying to view rankings at any given time (i.e. within the same second) will not be that high (i.e. no more than 30-40 in the same second).
* When people look at rankings, they will be looking at a subset (i.e. a single division, a single machine, a single player).
* Write operations are far more expensive than query operations.

The downside is that we get this great performance through extremely ugly sql queries.  These queries have been documented in the [sql queries README](back/app/routes/SQL_QUERIES.md) - please read it if you want to see how the queries work.

#Backend : Routes

**Organization of routes :**

Originally, routes were organized based on the sqlalchemy object they interacted with (i.e. routes that interacted with the Player class when in player.py).  Unfortunately, this strategy didn't scale well, and it got messy.  There is a issue opened to refactor the routes so that the file names are based on the head of the routes (i.e. /person, /entry, /score, etc).

There is currently a directory back/app/routes/v1 - this is where the reorganized routes are going.  Not only are routes be reorganized, but the URLs will will be changed to make the operation they perform be more obvious.    

**Permissions/Security :**

Most of TOM's flask routes require a user to be logged in to use - [flask-login](http://flask-login.readthedocs.io/en/latest/) takes care of logging in a user, preserving their login info in the flask session, and logging out.  The @login_required decorator is used on routes which are only accessible to a logged in user.    

Once a user is logged in, we use [flask-principal](http://pythonhosted.org/Flask-Principal/) to control access for the different users.  Short story : each user has one or more roles (i.e. desk worker, admin, scorekeeper) associated with them in the database.   Those roles are used to define a Permission class (which is provided by flask-principal) and defines a set of roles that are needed in order to do something.  When appropriate, the flask routes in TOM are wrapped with the Permission - if the logged in user does not have the roles defined by the permission, then the route fails and returns a 403 status code to the client.  For example, the Void_Permission.require() decorater wraps the /void/ticket route, and prevents users without the Voider role to access the /void/ticket route.

Permissions are defined in the app/__init__.py file.

**Throwing Exceptions :**

If you encounter a problem inside of a route, the prefered way to stop route processing is to throw an exception.  Flask provides a number of exceptions - the two most popular are Conflict and BadRequest - these will stop route processing, and return the appropriate HTTP return code.  The AngularJS app will intercept these (based on the non 200 return code), display an appropriate error (based on the contents of the response which were filled in by the exception), and then return the AngularJS app to the home page

Note the ImATeapot excepetion is different - the AngularJS app will display an error (based on the contents of the exception), but it will not forward the AngularJS app to the home page - instead it will use one of the fields in the response (set by the ImATeapot exception) to determine where to forward the app.  Search for i_am_a_teapot to see examples of this.  


**FetchEntity :**

FetchEntity is a decorator function in back/app/routes/util.py.  It's purpose is to take url param of the format <entity>_id (i.e. player_id - note that it is expecting the entity to be all lowercase), and then use that variable (which has the id for that entity) to lookup the requested entity (i.e. use player_id to lookup and return the Player with player_id) and pass it along to the route function.  If the <entity>_id can not be looked up, it throws an exception. 

#Backend : rendering results pages

FILL ME IN


#Backend : tomtests - unit and integration tests

FILL ME IN

#Frontend : What's Where?

This is what the top level backend directory looks like
```
Gruntfile.js
```
The config file for grunt ( see section below on Gruntfile )

```
bower.json
```
package list of dependencies to install with bower

```
src
```
The actual AngularJS html and javascript

```
add_to_controller.pl
```
Helper for adding a new route/controller/html for the AngularJS app

```
styles
```
Any custom css we want pulled into our AngularJS app

```
package.json
```
package list of dependencies to install with npm

```
util
```
utilities and helpers

#Frontend : Before you start
Please read the docs and do the quickstart/tutorial for each of these components :  
* [AngularJS](https://docs.angularjs.org/tutorial)
* [MobileAngular](http://mobileangularui.com/)
* [AngularUI router](https://github.com/angular-ui/ui-router/wiki)
* [Angular Bootstrap](https://angular-ui.github.io/bootstrap/)
* Bootstrap(http://getbootstrap.com/)

#Frontend : Gruntfile
In the [Installation Instructions](INSTALLATION_INSTRUCTIONS.md), there was a step with the following command 
```
./node_modules/grunt-cli/bin/grunt --backend_ip=<ip address of backend machine>

```
[Grunt](http://http://gruntjs.com/) is a javascript task runner.  We use it to prepare the AngularJS web app part of TOM and deploy it.  The Gruntfile.js specifies the following things be done when we run grunt :

* cleans the directory where the AngularJS web app gets deployed (/var/www/html/dist and /var/www/html/player)
* pulls all the files downloaded from bower, and concats them into a single file (_bower.js)
* pulls all the files downloaded from npm, and concats them all and appends to the main file that defines the AngularJS app (app.js) 
* concats all html files and inserts them into a javascript file (app_html_templates.js)
* concats all the files we've been concating and appends them to a single file ( app.js )
* copies all non-html and javascript files and top level index.html (or player.html) to deploy directories
* replaces the string '[APIHOST]' in the deployed app.js to the ip specified with the --backend_ip option

This Gruntfile.js assumes the following things :
* That you have write access to /var/www/html
* That apache is installed and service docs from /var/www/html
* That you have a TOM backend server running on port 8000 (with the player_login config option set to False)
* If you want to allow player login for purchasing tickets, you also must have a TOM backend server running on port 8001 (with the player_login config option set to True)

Once you run the grunt command listed above, the end result will be two directories created in /var/www/html :
```
dist/
player/
```

The dist/ directory will have the web interface to admin/scorekeeper/deskworker functionality - it can be accessed to http://<host_ip>/dist

The player/ directory will have the web interface to player ticket purchase functionality - it can be accessed to http://<host_ip>/player

What is the difference between what is deployed in dist/ and player/?  The javascript code deployed to dist/ and player/ is the same - the difference is the top level html file.  The player.html will only allow you to do three things : login as a player, purchase tickets as a player, and logout.   

NOTE : if you run the following program, it will setup a watcher - if anything is changed under front/src, grunt will be rerun and your AngularJS app will be reployed:
```
./node_modules/grunt-cli/bin/grunt --backend_ip=<ip address of backend machine> watch

```



#Frontend : The AngularJS App

The AngularJS app is defined in front/src/app/app.js.  Actually, it might be more accurate to say we start to define it in front/src/app/app.js.  If you look in app.js, you'll see three things :
* module TOMApp is defined
* a controller named IndexController is defined
* the TOMApp module includes a number of modules - a number of them start with 'app.' - these are where we define the rest of the modules and controllers.

TOMApp is the toplevel angular module - it includes everything else.  The IndexController (added to the TOMApp function) is used in the toplevel index.html.  The 'app.*' modules are all defined in subdirectories of front/src/app.  The html files and javscript files in these directories are appended to the app.js via grunt.          

The directory structure under front/src/app mirrors the AngularUI Router routes.  Where do the routes get defined?  There is a routes.js file in front/src/app and in each of the toplevel subdirs under front/src/app.  All of these get appended to app.js via grunt.

If we look at one of the javascript files in one of the subdirectories under front/src/app, you'll notice 2 things :
* that the module defined in the javascript file is named the same as the directory
* that the controller defined in the javascript file is named the same as the directory

The end result of all this is that the javascript and html for each AngularUI route is nicely grouped in a directory named after the route.  It's also easy during debugging to identify which directory a controller or module is located in.

#Frontend : Whats under front/src/

The following is a description of the directories under front/src :

```
front/src/app
```
This is where all the modules and controllers live, along with html for each AngularUI route

```
front/src/services
```
Where the angular services live

```
front/src/directives
```
Where the custom Angular directives live

```
front/src/shared_html
```
html chunks that are shared between various AngularUI routes

#Frontend : Angular services

There are 3 services you are going to care about initially - if you want to know more about them, please read the comments in the code :

```
timeout_resources.js
```
This defines a number of Angualr $resources for talking to the TOM backend REST api.  

```
status_modal.js
```
This takes care of displaying a number of modals : the loading modal, the error modal, and the "pay fucking attention" modal

```
page.js
```
This keeps track of if you are logged in or not, and if you are, who you are logged in as

#Frontend : using timeout_resources.js

The main job of the frontend is to talk to the backend.  We use [Angular $resources](https://docs.angularjs.org/api/ngResource/service/$resource) to do this.  The problem with $resources is they are asynchronous - and dealing with async operations in javascript is a pain in the ass.  In addition, global timeout times for $resources are ignored - so if we want to specify a timeout value for http requests, we have to do it for each $resource created (this is a known problem).  So, to solve this problem we have two functions in timeout_resources.js :
* generate_resource_definition()
* generic_resource()
* GetAllResources()

generate_resource_definition() generates a $resource for a given URL and HTTP action (i.e. put,post,get,delete) - this $resource has a timeout value set for the http request.  generic_resource() takes the $resouce and generates a function.  This function starts the $resource http request, and immediately returns a $resource promise which gets resolved when the http request either finishes or times out.  The function returned by generic_resource() can also take a $resource promise as an argument - if a $resource argument is passed in, it will wait for that promise to resolve before starting the http request.

One the function returned by generic_resource() gets a result back from the http request, it will put the results in a global dictonary/object - the key used in the global dictionary/object is specified as an argument to the function returned by generic_resource().  This global dictionary/object can be retrieved by using the GetAllResources() function.

Every Angular controller in the AngularJS app uses this for communicating with the backend so there are plenty of examples to look at.

Let's say you want to use information returned from a first http request into a second http request.  You can't just pass the information into the function generated by generic_resource() for the second request because the value you pass in won't exist yet.  For example,  I use the GetPlayer() function to get player info and then the GetTeam() function to get team info based on the player_id I'm expecting from GetPlayer.  The problem is the controller won't wait for GetPlayer() to finish before it calls GetTeam().  Here is an example of how you can get around this :
```
$scope.player_promise = TimeoutResources.GetPlayer($scope.tournaments_promise,{player_id:$scope.player_id});

$scope.player_promise.then(function(data){            
   return TimeoutResources.GetIfpaPlayer(undefined,{player_name:data.first_name+data.last_name});            
})

```
Note that you need to use the .then() method of the promise, you MUST return the promise returned by GetIfpaPlayer() inside that .then(), and that the "data" argument will contain the results of thehttp request run inside GetPlayer().

#Frontend : AngularMobile,Bootstrap, and Angular Bootstrap

FILL ME IN

