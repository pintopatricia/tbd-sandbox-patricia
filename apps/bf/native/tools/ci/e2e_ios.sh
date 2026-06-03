#!/bin/bash

set -e

BRAND=$1
if [[ -z "$BRAND" ]]; then
  echo "BRAND environment variable is not set."
  exit 1
fi 

BRAND_LOWERCASE=$(echo "${BRAND}" | tr '[:upper:]' '[:lower:]')
ARTIFACTORY_SUFFIX=$(jq -r '.ARTIFACTORY_SUFFIX' apps/bf/native/brands/"${BRAND_LOWERCASE}"/brand.config.json)
APP_BRAND_NAME=$(jq -r '.APP_BRAND_NAME' apps/bf/native/brands/"${BRAND_LOWERCASE}"/brand.config.json)
BRAND_LABEL_LOWERCASE=$(jq -r '.BRAND_LABEL' apps/bf/native/brands/"${BRAND_LOWERCASE}"/brand.config.json | tr '[:upper:]' '[:lower:]')

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

if [[ -z $IOS_BUILD_NUMBER ]];
then
    IOS_BUILD_NUMBER=$(curl https://artifactory-prd.prd.betfair/artifactory/tbd-native/ios/${BRAND_LABEL_LOWERCASE}/qa/ | grep -oE "${APP_BRAND_NAME}-([0-9]+).app.zip" |  grep -Eo "[0-9]+\." | grep -Eo "[0-9]+"| sort -nr | head -1)

    if [[ -z $IOS_BUILD_NUMBER ]];
    then
        echo -e "\n"
        echo "ERROR: curl failed to retrieve a build number, exiting..."
        echo -e "\n"
        exit 1;
    fi
fi

mkdir -p reports
chmod -R 755 reports

yarn workspaces focus @ppb/tbd-tests-native
yarn prepare
recordVideo=true appToInstall=https://artifactory-prd.prd.betfair/artifactory/tbd-native/ios/${BRAND_LABEL_LOWERCASE}/qa/${APP_BRAND_NAME}-${IOS_BUILD_NUMBER}.app.zip  yarn native:ios:e2e:${BRAND_LABEL_LOWERCASE}:qa:ci
