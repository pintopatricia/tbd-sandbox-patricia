#!/bin/bash

set -e

# validate product (exc)
if [ "$1" ]; then
    PRODUCT=:$1
fi

npm install -g yarn@1.22.10
yarn install
yarn prepare
cd apps/bf/web
yarn build:local
yarn perf
cd ../../
yarn rpm$PRODUCT
