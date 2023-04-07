#!/bin/bash

set_default() {
    if [ -z "$1" ]; then
        echo $2
    fi
    echo $1
}

create_postres_db() {
    # username = $1
    # password = $2
    # db_name = $3
    echo "CREATE ROLE $1 LOGIN password '$2';CREATE DATABASE $3 ENCODING 'UTF8' OWNER $1;" | sudo -u postgres psql
}

dump_postgres_db() {
    # username = $1
    # password = $2
    # db_name = $3
    pg_dump --dbname=postgresql://$1:$2@localhost:5432/$3 >./seed/$3_dump.sql
}

seed_postgres_db() {
    # username = $1
    # password = $2
    # db_name = $3
    psql --dbname=postgresql://$1:$2@localhost:5432/$3 <./seed/$3_dump.sql
}

delete_db() {
    # db_name = $1
    echo "DROP DATABASE $1;" | sudo -u postgres psql
}
