#!/bin/bash

set -e

export NODE_TLS_REJECT_UNAUTHORIZED=0
VERSION="1.22.10"
PACKAGE="yarn"

# Check if yarn is installed and if so, push the version into a variable
INSTALLED_VERSION=$(yarn --version 2>/dev/null)

if [[ "$INSTALLED_VERSION" == "$VERSION" ]]; then
  echo "$PACKAGE@$VERSION is already installed."
else
  echo "$PACKAGE@$VERSION is not installed. Installing..."
  npm install -g "$PACKAGE@$VERSION"
fi

yarn install
yarn prepare
cd apps/bf/web
yarn test:regression:grid:e2e
