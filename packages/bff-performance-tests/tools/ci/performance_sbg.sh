#!/bin/bash

set -e

mkdir reports

npm install -g yarn@1.22.10
yarn install
cd packages/bff-performance-tests
yarn install
TLA_NAME="tbdsbg" BUILD_DATE=$(date "+%s%N" | cut -b1-13) yarn run test:ci:sbg
