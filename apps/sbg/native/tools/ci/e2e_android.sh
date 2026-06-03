#!/bin/bash

set -e

if [[ -z $ANDROID_BUILD_NUMBER ]];
then
    ANDROID_BUILD_NUMBER=$(curl https://artifactory-prd.prd.betfair/artifactory/tbd-native/android/sbg/ | grep -oE "SkyBet-([0-9]+).apk" |  grep -Eo "[0-9]+\." | grep -Eo "[0-9]+"| sort -nr | head -1)

    if [[ -z $ANDROID_BUILD_NUMBER ]];
    then
        echo -e "\n"
        echo "WARNING: curl failed to retrieve a build number, using latest"
        echo -e "\n"
    fi
fi

VERSION="1.22.10"
PACKAGE="yarn"

# Check if yarn is installed and if so, push the version into a variable
INSTALLED_VERSION=$(yarn --version 2>/dev/null)

export NODE_TLS_REJECT_UNAUTHORIZED=0


mkdir reports
if [[ "$INSTALLED_VERSION" == "$VERSION" ]]; then
  echo "$PACKAGE@$VERSION is already installed."
else
  echo "$PACKAGE@$VERSION is not installed. Installing..."
  npm install -g "$PACKAGE@$VERSION"
fi
yarn workspaces focus @ppb/tbd-tests-native
yarn prepare
BUILD_NUMBER=$ANDROID_BUILD_NUMBER yarn native:android:e2e:sbg:qa:ci
