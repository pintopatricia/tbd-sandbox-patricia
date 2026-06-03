#!/bin/sh
## Usage: ./prompt

currentDir="$(dirname "$0")"
. "$currentDir/../utils.sh"

brand=${BRAND:-bf}
appConfig=$NATIVE_PROJECT_DIR/app.config.json

echo "${CYAN}info${NC} This script will use ${appConfig} from ${brand}."

# read TBDN_ANDROID_DEVICE_NAME from app.config.json
if [ -f $appConfig ]; then
    deviceNameValues=$(grep TBDN_ANDROID_DEVICE_NAME $appConfig)
    environmentValues=$(grep TBDN_DEFAULT_ENVIRONMENT $appConfig)
fi

# check if env variable values are empty - if so, prompt user for emulator selection
if [ -z "$deviceNameValues" ]; then
    request_emulators_android
else
    echo "${CYAN}info${NC} Current emulator selection already defined. ${YELLOW}Skipping step...${NC}"
fi

# check if env variable values are empty - if so, prompt user for environment selection
if [ -z "$environmentValues" ]; then
    request_environments
else
    echo "${CYAN}info${NC} Current environment selection already defined. ${YELLOW}Skipping step...${NC}"
fi

echo "${YELLOW}hint${NC} Note: You can swap emulator or environment configs anytime by running from ./tests: ./scripts/settings/select.sh"
