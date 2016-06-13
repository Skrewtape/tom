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
Run the following commands.  Insert a username and password where specified (`<tom_db_user_password>` and `<tom_db_username>`) - this will be the username and password that TOM uses to access postgresql with, and will be needed in further steps.  
```
sudo su - postgres
psql -c "CREATE USER <tom_db_username> WITH PASSWORD '<tom_db_user_password>'; create database tom_server; GRANT ALL PRIVILEGES ON DATABASE tom_server to <tom_db_username>;"
psql tom_server -c "CREATE FUNCTION testing_papa_scoring(rank real) RETURNS real AS \$\$ BEGIN IF rank = 1 THEN RETURN 100; ELSIF rank = 2 THEN RETURN 90; ELSIF rank = 3 THEN RETURN 85; ELSIF rank < 88 THEN  RETURN 100-rank-12; ELSIF rank >= 88 THEN RETURN 0; END IF; END; \$\$ LANGUAGE plpgsql;"
psql tom_server -c "CREATE FUNCTION finals_papa_scoring(rank real) RETURNS real AS \$\$  BEGIN IF rank = 1 THEN RETURN 3; ELSIF rank = 2 THEN RETURN 2; ELSIF rank = 3 THEN RETURN 1; ELSIF rank = 4 THEN RETURN 0; END IF; END; \$\$ LANGUAGE plsgsql;"
```

### Install python dependencies
```
cd back
./setup.py
```

### Bootstrap database
For the init_clean_db script below, you will need to provide an admin username and password on the command line.  As part of database initialization, it will create an admin user which you will use to log into TOM.  
```
cd back
source venv/bin/activate
export DATABASE_URL=postgres://<tom_db_username>:<tom_db_user_password>@localhost/tom_server
./tom_utils_bin/init_clean_db.py --admin_username <admin username> --admin_password <admin password>
```

### Install Angular dependencies 
```
cd front
npm install
./node_modules/bower/bin/bower --allow-root install
```

### "Compile" and Install Angular App
```
cd front
./node_modules/grunt-cli/bin/grunt --backend_ip=<ip address of backend machine>
```

If you are running everything on one machine, then the ip address of the backend machine is the ip of the machine you are running currently working on.

### Edit tom_config.py and create secret_config.py
Configuration information for TOM is held in 2 files :
```
back/app/tom_config.py
back/app/secret_config.py
```

secret_config.py holds "secret" information (i.e. the key to use to encrypt flask session info, etc), and tom_config.py holds all the non-secret config info.

The contents of both files is documented in the [Config README](back/app/CONFIG_README.md).

### Allowing players to login and purchase tickets

FILL ME IN

### Setting up TOM to use stripe

FILL ME IN

### Setting up DB Replication on Server (OPTIONAL)
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

