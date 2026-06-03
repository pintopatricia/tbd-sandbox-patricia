#!/bin/bash

set -e

export NODE_TLS_REJECT_UNAUTHORIZED=0
pwd
if [[ "$branch" == "" ]]; then
  package_branch=$(cat dep-metadata.txt | jq -r '.[] | select(.branch) | .branch')
  echo "### Checkout branch from build ###"
  git checkout $package_branch
else
  echo "### Checkout the parameter branch ###"
  git checkout $branch
fi
npm install -g yarn@1.22.10
yarn install
yarn prepare
cd apps/bf/web
yarn test:regression:grid:e2e
