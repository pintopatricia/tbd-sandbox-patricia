#!/bin/bash

set -e  # Exit on error

RELEASE_VERSION="$1"
yarn install
yarn prepare

security unlock-keychain -p $MAC_PASS ~/Library/Keychains/login.keychain-db
node ./tools/ci/monterosa-gitlab-access.js

cd apps/sbg/native/ios

function updatePodfileInSBG() {
    podfilePath="./Podfile"
    gamesFrameworkPodspec=$(cat "$podfilePath" | grep -i "pod 'GamesFramework', :git => ")
    newGamesFrameworkPodspec="  pod 'GamesFramework', :git => 'https://github.com/Flutter-Global/uki-gaming-games-framework-ios.git', :tag => '$RELEASE_VERSION'"
    sed -i -e "s|$gamesFrameworkPodspec|$newGamesFrameworkPodspec|gi" "$podfilePath"
    bundle install
    bundle exec pod install --repo-update
}

updatePodfileInSBG
security lock-keychain ~/Library/Keychains/login.keychain-db
