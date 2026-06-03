#!/bin/bash

set -e

npm install -g yarn@1.22.10
yarn install
yarn prepare

chmod +x tools/generate-env-files.sh
./tools/generate-env-files.sh --brand BF

cd apps/tbd-http-webserver/
yarn build
yarn rpm
