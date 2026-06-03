#!/bin/bash

set -e
BRAND=$1
if [[ -z "$BRAND" ]]; then
  echo "BRAND environment variable is not set."
  exit 1
fi 

source tools/ci/jenkins_scriptsLogs.sh
# Redirect logs to a text file using functions from the source script file.
info 'Starting script'

BRAND=$(echo "${BRAND}" | tr '[:upper:]' '[:lower:]')
APP_BRAND_NAME=$(jq -r '.APP_BRAND_NAME' apps/bf/native/brands/"${BRAND}"/brand.config.json)

VERSION="1.22.10"
PACKAGE="yarn"

# Check if yarn is installed and if so, push the version into a variable
INSTALLED_VERSION=$(yarn --version 2>/dev/null)

sed -i "s/FACEBOOK_APP_ID/$FB_APP_ID/g" apps/bf/native/android/app/src/main/res/values/configs.xml
sed -i "s/FACEBOOK_APP_TOKEN/$FB_APP_TOKEN/g" apps/bf/native/android/app/src/main/res/values/configs.xml
if [[ "$INSTALLED_VERSION" == "$VERSION" ]]; then
  echo "$PACKAGE@$VERSION is already installed."
else
  echo "$PACKAGE@$VERSION is not installed. Installing..."
  npm install -g "$PACKAGE@$VERSION"
fi
execute 'yarn workspaces focus @ppb/tbd-native'
cd apps/bf/native
execute 'yarn android:build:ci'
mkdir -p android/app/build/outputs/apk/play/inhouse
sh scripts/copy-compiled-apk.sh inhouse
mv android/app/build/outputs/apk/play/inhouse/app-play-inhouse.apk android/app/build/outputs/apk/play/${APP_BRAND_NAME}-${BUILD_NUMBER}.apk
cp android/app/build/outputs/apk/play/${APP_BRAND_NAME}-${BUILD_NUMBER}.apk android/app/build/outputs/apk/play/${APP_BRAND_NAME}-latest.apk