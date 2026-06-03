#!/bin/bash

set -e

# valid brands=(bf,sbg,pp,ps) 
BRAND=$1

if [ -z "$BRAND" ]; then
    echo "No brand given. Use one of the valid brands(bf,sbg,pp,ps)"
    exit 1
fi

npm install -g yarn@1.22.10
yarn install
yarn prepare
cd apps/$BRAND/web
yarn build:local
yarn perf
cd ../../
yarn rpm:$BRAND
