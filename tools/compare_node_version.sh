#!/bin/bash

NODE_VERSION="$(node -v)"
NODE_VERSION_REQUIRED=$npm_package_config_node_version

RED="\033[1;31m"
GREEN="\033[1;32m"
NOCOLOR="\033[0m"

if [ "$NODE_VERSION" != "$NODE_VERSION_REQUIRED" ] ; 
then
    MESSAGE="You have version $NODE_VERSION installed.\nPlease install node $NODE_VERSION_REQUIRED\n"

    echo -e "${RED}$MESSAGE${NOCOLOR}"

    exit 2
fi

echo -e "${GREEN}Correct node version installed: $NODE_VERSION${NOCOLOR}"

exit 0