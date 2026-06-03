#!/bin/bash

set -e

export NODE_OPTIONS=--max_old_space_size=4096
npm install -g yarn@1.22.10
yarn install
yarn prepare
cd apps/bf/web
yarn build:local
cd ../../
yarn rpm
