#!/bin/bash
. ./helpers.sh
. ./configs.sh

read -p "Enter db name to drop [default=$default_db_name]:" db_name
db_name=$(set_default $db_name $default_db_name)

delete_db $db_name
