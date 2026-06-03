#!/bin/bash -i

set -e

export IOS_BUILD_NUMBER=$BUILD_NUMBER
export MATCH_KEYCHAIN_NAME='SBGN_App'

security unlock-keychain -p $MAC_PASS ~/Library/Keychains/login.keychain-db
node ./tools/ci/monterosa-gitlab-access.js

yarn workspaces focus @ppb/tbdsbg-native
yarn prepare
cd apps/sbg/native
yarn environment qa
yarn releaseMode internal
cd ios

export IOS_BUILD_NUMBER=$BUILD_NUMBER

if [[ $IS_MR_BUILD == true ]]; then
    # update GamesFramework podspec version in podfile
    podfilePath="./Podfile"
    gamesFrameworkPodspec=$(cat "$podfilePath" | grep -i "pod 'GamesFramework', :git => ")
    newGamesFrameworkPodspec="  pod 'GamesFramework', :git => 'https://github.com/Flutter-Global/uki-gaming-games-framework-ios.git', :commit => '$GF_MERGE_REQUEST_ID'"
    sed -i -e "s|$gamesFrameworkPodspec|$newGamesFrameworkPodspec|gi" "$podfilePath"

    bundle install
    bundle exec pod install --repo-update

    SHOULD_USE_WEB_VIEW_LAUNCH=$(/usr/libexec/PlistBuddy -c "Print :GamingSettings:WebViewLaunch" ../../native/ios/tbd_native/Info.plist | tr -d "[:space:]")
    export SHOULD_USE_WEB_VIEW_LAUNCH="$SHOULD_USE_WEB_VIEW_LAUNCH"
    bundle exec fastlane in_house_gaming_firebase operation:touch

    cd ..
    # Read the link_to_app file that will have the firebase link for the app generated
    LINK_TO_APP=$(cat ios/link_to_app)
    ../../../node_modules/.bin/qrcode -o "QR-CODE-SBG-IN-HOUSE-$GF_MERGE_REQUEST_ID.png" "$LINK_TO_APP"
else
    REUSE_ASSET_PACKS=$( [ -z "$REUSE_ASSET_PACKS" ] && echo "Yes" || echo "$REUSE_ASSET_PACKS")
    if [[ "$SHOULD_USE_WEB_VIEW_LAUNCH" == "Yes" ]]; then
        SHOULD_USE_WEB_VIEW_LAUNCH="true"
    else
        SHOULD_USE_WEB_VIEW_LAUNCH="false"
    fi
    export SHOULD_USE_WEB_VIEW_LAUNCH="$SHOULD_USE_WEB_VIEW_LAUNCH"

    if [[ "$REUSE_ASSET_PACKS" == "Yes" ]]; then
        echo "Will build with the prebuild assets packs"
        operation="touch"
    else
        echo "Will build with new custom list of games"
        operation="add"
    fi

    if  [[ -z "$PROVIDERS_LIST" ]] || [[ $PROVIDERS_LIST == "ALL"*  ]]; then
      PROVIDERS_LIST=ALL
      addLive=true
    fi

    if grep -q "PlaytechLive" <<< "$PROVIDERS_LIST"; then
      addLive=true
    fi

    # Remove PlaytechLive from the list of providers a it is a framework
    PROVIDERS_LIST=$(echo "$PROVIDERS_LIST" | sed "s/,PlaytechLive//" | sed "s/PlaytechLive\,//")
    if [[ $PROVIDERS_LIST == "PlaytechLive" ]] && [[ -z $GAMES_LIST ]]; then
      PROVIDERS_LIST="Playtech"
      GAMES_LIST="none"
      addLive=true
    fi

    GAMES_LIST=$( echo "$GAMES_LIST" | tr -d '"' )

    bundle install
    bundle exec pod install --repo-update

    SHOULD_USE_SPLIT_ODR=$( [ -z "$SHOULD_USE_SPLIT_ODR" ] && echo false || echo "$SHOULD_USE_SPLIT_ODR")

    bundle exec fastlane in_house_gaming_firebase --env dev operation:"$operation" providers:"$PROVIDERS_LIST" games:"$GAMES_LIST" addLive:"$addLive" source:"$GAMES_RESOURCES_SOURCE" has_split_odr_resources:"$SHOULD_USE_SPLIT_ODR"
fi
security lock-keychain ~/Library/Keychains/login.keychain-db
