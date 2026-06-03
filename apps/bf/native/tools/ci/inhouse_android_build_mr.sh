#!/bin/bash

set -e

VERSION="1.22.10"
PACKAGE="yarn"

# Check if yarn is installed and if so, push the version into a variable
INSTALLED_VERSION=$(yarn --version 2>/dev/null)

BRAND=$1
if [[ -z "$BRAND" ]]; then
  echo "BRAND environment variable is not set."
  exit 1
fi 

BRAND_LOWERCASE=$(echo "${BRAND}" | tr '[:upper:]' '[:lower:]') 
ARTIFACTORY_SUFFIX=$(jq -r '.ARTIFACTORY_SUFFIX' apps/bf/native/brands/"${BRAND_LOWERCASE}"/brand.config.json)
APP_BRAND_NAME=$(jq -r '.APP_BRAND_NAME' apps/bf/native/brands/"${BRAND_LOWERCASE}"/brand.config.json)
BRAND_LABEL_LOWERCASE=$(jq -r '.BRAND_LABEL' apps/bf/native/brands/"${BRAND_LOWERCASE}"/brand.config.json | tr '[:upper:]' '[:lower:]')

if [[ "$INSTALLED_VERSION" == "$VERSION" ]]; then
  echo "$PACKAGE@$VERSION is already installed."
else
  echo "$PACKAGE@$VERSION is not installed. Installing..."
  npm install -g "$PACKAGE@$VERSION"
fi

sed -i "s/FACEBOOK_APP_ID/$FB_APP_ID/g" apps/bf/native/android/app/src/main/res/values/configs.xml
sed -i "s/FACEBOOK_APP_TOKEN/$FB_APP_TOKEN/g" apps/bf/native/android/app/src/main/res/values/configs.xml
yarn workspaces focus @ppb/tbd-native
cd apps/bf/native
yarn android:build:ci
mkdir -p android/app/build/outputs/apk/play/inhouse
sh scripts/copy-compiled-apk.sh inhouse
mv android/app/build/outputs/apk/play/inhouse/app-play-inhouse.apk android/app/build/outputs/apk/play/${APP_BRAND_NAME}-MR-${ghprbPullId}-${BUILD_NUMBER}.apk

git clone git@github.com:Flutter-Global/tbd-qrcode.git

LINK_TO_APP="https://artifactory-prd.prd.betfair/artifactory/tbd-native/android/${ARTIFACTORY_SUFFIX:+${ARTIFACTORY_SUFFIX}/}${APP_BRAND_NAME}-MR-"${ghprbPullId}"-"${BUILD_NUMBER}".apk"
../../../node_modules/.bin/qrcode -o ./tbd-qrcode/QR-CODE-${ghprbPullId}-${BUILD_NUMBER}.png $LINK_TO_APP

# Upload to github
echo "Uploading the image to github"
cd tbd-qrcode
git add QR-CODE-${ghprbPullId}-${BUILD_NUMBER}.png
git commit -m "add QRCode for PR ${ghprbPullId}"
git push origin main
