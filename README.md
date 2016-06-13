# Overview
TOM is pinball tournament scoring software that lets you run multiple concurrent tournaments.  It has the following features :
* Single Player and Team tournaments
* Tournaments with different scoring styles ( PAPA, Herb, etc )
* Qualifying scorekeeping
* Finals scorekeeping
* Displaying up-to-date qualifying results
* Displaying finals results

# Quickstart
These steps assume that you are logged in as root, and running from the top level of the TOM git repo, and you are installing on the machine you are running a browser on.

* Follow the steps in [INSTALL_INSTRUCTIONS.md](INSTALL_INSTRUCTIONS.md)
* To start the TOM backend, run the following commands ( substitue tom database username/password you created while following INSTALL_INSTRUCTIONS )

```
cd back
source venv/bin/activate
export DATABASE_URL=postgres://<tom_username>:<tom_password>@localhost/tom_server
env PYTHONPATH=`pwd` ./tom_util_bin/gunicorn.cmd
```

Congratulations!  TOM is now running on your machine.  The admin/scorekeeping/desk worker interface is available at the following url: 
```
http://localhost/dist
```
You can login using the users created by init_clean_db script.

The results page is at the following url : 
```
http://localhost:8000/results/index
```

# Contributing to the project 

Please look at the document [CONTRIBUTING.md](CONTRIBUTING.md)