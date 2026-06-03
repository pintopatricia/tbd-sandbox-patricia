#!/bin/bash -i

set -e

export MATCH_KEYCHAIN_NAME='TBDN_App'
yarn install
yarn prepare
cd apps/bf/native/ios/
bundle install
bundle exec pod install --repo-update

RESOURCES_VERSION=$(/usr/libexec/PlistBuddy -c "Print :GamingSettings:ResourcesVersion" ../../../native/ios/tbd_native/Info.release.plist | tr -d "[:space:]")

bundle exec fastlane in_house_asset_packs --env dev resourcesVersion:"$RESOURCES_VERSION"
