#!/bin/bash

set -e

npm install -g yarn@1.22.10
yarn install
yarn prepare
cd apps/sbg/web
yarn build:local
yarn perf
cd ../../
yarn rpm:sbg
