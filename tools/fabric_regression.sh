#!/bin/bash
# this script is meant to be executed inside
#   apps/tbd-http-webserver
#   apps/bf-tbd-http-bff-gql

set -e

STRAND_CONFIG_FILE=$1

STRAND_PWD=$(pwd)

TOOLS_DIR=$(dirname $(readlink -f "$0"))

NODE_TLS_REJECT_UNAUTHORIZED=0 node $TOOLS_DIR/run-download-mockserver.js

cp ./regression-tests/config/header-strategies/admin.js $TOOLS_DIR/../node_modules/@ppb/fabric-envelope/lib/header-strategies/admin.js
cp ./regression-tests/config/header-strategies/basic.js $TOOLS_DIR/../node_modules/@ppb/fabric-envelope/lib/header-strategies/basic.js

yarn build:dev
yarn fabric:config

MOCKSERVER_PROPERTY_FILE=$STRAND_PWD/regression-tests/config/mockserver.properties \
java -Xmx300m -jar $TOOLS_DIR/../node_modules/.bin/mockserver-netty-*-jar-with-dependencies.jar \
-serverPort 1081 &

MOCKSERVER_PID=$!

function cleanup()
{
    kill -9 $MOCKSERVER_PID
}

trap cleanup EXIT

NODE_ENV=dev TZ=America/Los_Angeles \
GLOBAL_AGENT_HTTP_PROXY=http://localhost:1081 NODE_TLS_REJECT_UNAUTHORIZED=0 \
node --inspect --enable-experimental-regexp-engine-on-excessive-backtracks \
-r $STRAND_PWD/regression-tests/config/mock-date.js \
-r 'global-agent/bootstrap' \
$TOOLS_DIR/../node_modules/.bin/fabric run $STRAND_CONFIG_FILE