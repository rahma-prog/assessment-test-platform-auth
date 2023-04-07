#!/bin/bash
. ./helpers.sh
. ./configs.sh

read -p "Enter seed db username [default=$default_db_username]:" db_username
read -p "Enter seed db user password [default=$default_db_password]:" db_password
read -p "Enter seed db name [default=$default_db_name]:" db_name

db_username=$(set_default $db_username $default_db_username)
db_password=$(set_default $db_password $default_db_password)
db_name=$(set_default $db_name $default_db_name)

seed_postgres_db $db_username $db_password $db_name
