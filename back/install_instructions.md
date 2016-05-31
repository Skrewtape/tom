create replication user on server :
sudo -u postgres psql -c "CREATE USER replicator REPLICATION LOGIN ENCRYPTED PASSWORD 'thepassword';"
----

edit postgres configs (fill this in later)

----
postgres replication script (on client):

echo Stopping PostgreSQL
sudo service postgresql stop
echo Cleaning up old cluster directory
sudo -u postgres rm -rf /var/lib/postgresql/9.5/main
echo Starting base backup as replication
sudo -u postgres pg_basebackup -h 10.142.0.2 -D /var/lib/postgresql/9.5/main -U replicator -v -P -W --xlog-method=s
tream
echo Writing recovery.conf file
sudo -u postgres bash -c "cat > /var/lib/postgresql/9.5/main/recovery.conf <<- _EOF1_
  standby_mode = 'on'
  primary_conninfo = 'host=10.142.0.2 port=5432 user=replicator password=thepassword sslmode=require'
  trigger_file = '/tmp/postgresql.trigger'
_EOF1_
"
echo Startging PostgreSQL
sudo service postgresql start
----

create papa scoring stored procedure on server:
psql tom_server -c "CREATE FUNCTION testing_papa_scoring(rank real) RETURNS real AS \$\$ BEGIN IF rank = 1 THEN RETURN 100; ELSIF rank = 2 THEN RETURN 90; ELSIF rank = 3 THEN RETURN 85; ELSIF rank < 88 THEN  RETURN 100-rank-12; ELSIF rank >= 88 THEN RETURN 0; END IF; END; \$\$ LANGUAGE plpgsql;"
----

