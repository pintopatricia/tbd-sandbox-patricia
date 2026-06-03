#!/bin/sh
## Usage: ./build_ios.sh

# import utils file
currentDir="$(dirname "$0")"
. "$currentDir/../utils.sh"

# default build type
build_type=In_House

# parse parameters and extract values
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -t|--buildtype)
            build_type="$2"
            shift
            ;;
        *)
            echo "Unknown parameter passed: $1"
            exit 1
            ;;
    esac
    shift
done

cd ios
if [ -e ./build/Build/Products/$build_type-iphonesimulator/Betfair.app ] ; then
    echo "${CYAN}info${NC} TBD native $build_type app already built. ${YELLOW}Skipping step...${NC}"
else
    echo "${CYAN}info${NC} Running bundle install"
    bundle install
    echo "${CYAN}info${NC} Installing pod dependencies..."
    bundle exec pod install --repo-update
    echo "${CYAN}info${NC} Creating a fresh $build_type build of the TBD Native app..."
    xcodebuild -quiet \
            -workspace tbd_native.xcworkspace \
            -scheme tbd_native \
            -configuration $build_type \
            -sdk iphonesimulator \
            -derivedDataPath build
fi
