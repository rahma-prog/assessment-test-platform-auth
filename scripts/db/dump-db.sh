#!/bin/bash
. ./helpers.sh
. ./configs.sh

read -p "Enter dump db username [default=$default_db_username]:" db_username
read -p "Enter dump db user password [default=$default_db_password]:" db_password
read -p "Enter dump db name [default=$default_db_name]:" db_name

db_username=$(set_default $db_username $default_db_username)
db_password=$(set_default $db_password $default_db_password)
db_name=$(set_default $db_name $default_db_name)

dump_postgres_db $db_username $db_password $db_name
