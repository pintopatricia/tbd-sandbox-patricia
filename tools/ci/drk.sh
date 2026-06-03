#!/bin/bash

set -e

export NODE_TLS_REJECT_UNAUTHORIZED=0
rm -rf reports
rm -rf allure-report
npm install -g yarn@1.22.10
yarn install
yarn prepare
cd apps/bf/web
yarn test:regression:grid:core
