echo Stopping PostgreSQL
sudo service postgresql stop
echo Cleaning up old cluster directory
sudo -u postgres rm -rf /var/lib/postgresql/9.5/main
echo Starting base backup as replication
sudo -u postgres pg_basebackup -h $1 -D /var/lib/postgresql/9.5/main -U replicator -v -P -W --xlog-method=s
tream
echo Writing recovery.conf file
sudo -u postgres bash -c "cat > /var/lib/postgresql/9.5/main/recovery.conf <<- _EOF1_
  standby_mode = 'on'
  primary_conninfo = 'host=$1 port=5432 user=replicator password=thepassword sslmode=require'
  trigger_file = '/tmp/postgresql.trigger'
_EOF1_
"
echo Startging PostgreSQL
sudo service postgresql start
