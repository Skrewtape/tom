#Install Instructions
### Overview
This document lists the steps to setting up TOM.  This document assumes you are running on a ubuntu 15 machine as root.  All relative paths are relative to the top level of the checked out TOM git repo.  

### Install packages
Run the following command
```
sh back/utils/install_packages.sh
sh front/utils/install_packages.sh
```

### Postgress configuration 
Run the following commands.  Insert a username and password where specified (`<tom_user_password>` and `<tom_user>`) - this will be the username and password that TOM uses to access postgresql with, and will be needed in further steps.  
```
sudo su - postgres
psql -c "CREATE USER <tom_user> WITH PASSWORD '<tom_user_password>'; create database tom_server; GRANT ALL PRIVILEGES ON DATABASE tom_server to <tom_user>;"
psql tom_server -c "CREATE FUNCTION testing_papa_scoring(rank real) RETURNS real AS \$\$ BEGIN IF rank = 1 THEN RETURN 100; ELSIF rank = 2 THEN RETURN 90; ELSIF rank = 3 THEN RETURN 85; ELSIF rank < 88 THEN  RETURN 100-rank-12; ELSIF rank >= 88 THEN RETURN 0; END IF; END; \$\$ LANGUAGE plpgsql;"
psql tom_server -c "CREATE FUNCTION finals_papa_scoring(rank real) RETURNS real AS \$\$  BEGIN IF rank = 1 THEN RETURN 3; ELSIF rank = 2 THEN RETURN 2; ELSIF rank = 3 THEN RETURN 1; ELSIF rank = 4 THEN RETURN 0; END IF; END; \$\$ LANGUAGE plsgsql;"
```

### Install python dependencies
```
export DATABASE_URL=postgres://postgres:`<tom_user>`:`<tom_user_password>`@localhost/tom_server
cd back
./setup.py
```

### Bootstrap database
Note that the seed_db.py will create default users ( admin, scorekeeper, and desk ) - if you are planning on using this in production, REMOVE THESE USERS
```
cd back
export PYTHONPATH=`pwd`
cd utils
ptyhon ./seed_db.py
```

### Install Angular dependencies 
```
front/npm install
cd front
./node_modules/bower/bin/bower --allow-root install
./node_modules/grunt-cli/bin/grunt
```

### Setting up DB Replication on Server
**_create replication user on server_**:

``` sudo -u postgres psql -c "CREATE USER replicator REPLICATION LOGIN ENCRYPTED PASSWORD 'thepassword';" ```

**_edit postgres configs on the server_**:

postgresql.conf :
```
listen_addresses = '<replication_machine_ip>'
wal_level = hot_standby
max_wal_senders = 5
wal_keep_segments = 32
archive_mode    = on
archive_command = 'cp %p /path_to/archive/%f'
```
pg_hba.conf:
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
  host  replication     replication     <replication_machine_ip>/32         md5
```
##Configure replication on replicated machine:
``` <path_to_tom>/back/util/start_replication.sh <ip_of_server> ```

