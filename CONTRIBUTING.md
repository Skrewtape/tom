#Overview
Welcome to the exciting world of adding features to/fixing bugs in TOM!  This document will cover the following subjects :

* Things you'll need to know before you start working on TOM
* TOM architecture overview 
* Details of TOM components
* How to get started with helping out

If you have any questions/comments/shower thoughts, there is a [slack](http://slack.com) instance where you can do this!  Our slack instance is called [tom-dev](https://tom-dev.slack.com/messages/general/) - try it out!  

Good luck!  

#TOM Architecture
TOM consists of two parts : a backend and a frontend.  The backend is a "REST" api (written in python using the [flask framework](http://flask.pocoo.org/)) with a postgress database behind it.  The frontend is an [AngularJS](https://angularjs.org/) web app.  Note that REST is in quotes - I tried to follow the rules of a REST interface, but sometimes got a little lazy.      

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
back/app/__init__.py
back/app/auth.py
back/app/routes
back/app/static
back/app/templates
back/app/tom_config.py
back/app/types
back/env.sample
back/requirements.txt
back/setup.py
back/setup.pyenv.py
back/tomtest
back/utils

```

```
back/app
```
This is the top level directory of the flask application

```
back/app/__init__.py
```
This is where the flask application initialization happens.  Starting a connection with the database, defining user permissions, defining error handlers, etc




#Frontend

Backend
* Flask ( link to quick start guide )
* SQLalchmey ( link to quick start guide/ tutorial )
* Postgress
* Install and Startup instructions

Flask
* Plugins/extensions
** Principal and LoginManager
** SQLalchemy
* directory structure and files
* typical route
* static vs dynamic

Postgress
* replication

Install and Startup instructions
