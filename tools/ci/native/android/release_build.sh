#!/bin/bash

set -e

export NODE_TLS_REJECT_UNAUTHORIZED=0

sed -i "s/FACEBOOK_APP_ID/$FB_APP_ID/g" apps/$BRAND/native/android/app/src/main/res/values/configs.xml
sed -i "s/FACEBOOK_APP_TOKEN/$FB_APP_TOKEN/g" apps/$BRAND/native/android/app/src/main/res/values/configs.xml

if [[ "$BRAND" == "sbg" ]]; then
  yarn workspaces focus @ppb/tbdsbg-native
else
 yarn workspaces focus @ppb/tbd-native
fi
yarn prepare

cd apps/$BRAND/native
yarn environment prd
yarn releaseMode production

if [[ "$OVERRIDE_LOADING_SUBDOMAIN" == "true" ]]; then
  yarn loadingSubdomain apitbdn-store
fi

if [[ "$FLAVOR" == "brazil" ]]; then
  FASTLANE_ACTION="buildReleaseBundleBrazil"

  # Apply custom loading domain to brazil build
  yarn loadingDomain betfair.bet.br
else
  FASTLANE_ACTION="buildReleaseBundle"
fi

cd android
bundle install
echo $RELEASE_KEYSTORE | base64 --decode > ./app/release.keystore
bundle exec fastlane android $FASTLANE_ACTION

