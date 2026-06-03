#!/bin/bash

#  1.generateCSV.sh
#
#   This script generates a CSV file with all the games available on our games assets repo.
#   In order to build this file we need some data from Prismic (for display name of the games) and the list of all the
#   assets from our games assets repo. The script is also fetching the old apps configs and will check the games present
#   there in the generated csv file.
#
#   Dependent scripts:
#       - checkDependencies.sh  - check for dependencies and try to configure them if missing
#       - getPrismicData.swift  - needed for Display name of the games
#       - generateCSV.swift     - generate the csv file
#
#  Created by Cosmin Titei on 05/02/2020.
#  Copyright © 2020 PaddyPowerBetfair. All rights reserved.

###### Todo
# 1. Error Handling:
#     - use different error codes for different errors
#     - reuse some codes also for other scripts for the same errors
# 2. check also for game embedded into the app bundle when loading previous app configs
######
BASEDIR=$(dirname "$0")
FILE_NAME=$(basename "$0")
TEMP_FOLDER="$BASEDIR/temp"
SCRIPTS_PATH="$BASEDIR/GamesManagementScripts"

# Defaults
DEFAULT_LOG_FILE="$TEMP_FOLDER/copyGames.log"

########################################################################################################################
function showHelp() {
    ##### Usage #####
    printf "USAGE:\n  %s [FLAGS]\n\n" "$0"

    ##### Flags #####
    printf "FLAGS:\n"
    printf "  --source      the path to the game assets. This flag is required and can be a path to a local folder or to a remote bucket.\n"
    printf "  --verbose     if present it will print the logs on the screen instead of the %s file \n" "$DEFAULT_LOG_FILE"
    printf "  --help, -h    show help\n\n"
    printf "You can also check https://flutteruki.atlassian.net/l/cp/sx0Z1dv1 for more details\n\n\n"

    ##### Examples #####
    printf "EXAMPLES:\n"

    printf "  0. Showing the help .\n"
    printf "        ./1.generateCSV.sh -h \n"
    printf "        ./1.generateCSV.sh --help \n"
    printf "  1. Generate allGame.csv file using a remote bucket as a games assets path.\n"
    printf "        ./1.generateCSV.sh --source=awsbf/gosw-games-assets-bf-dev \n"
    printf "  2. Generate allGame.csv file using a local folder for games assets path.\n"
    printf "        ./1.generateCSV.sh -s=/Users/SomeUser/temp/games-assets \n"

    ##### END #####
    printf "\n\n"
}
########################################################################################################################
# Logging function
## add extra param in order to override $VERBOSE flag value
function logMessage() {
    if [[ $VERBOSE == "true" ]] || [[ $3 == "true" ]]; then
        printf "[%s] \t $FILE_NAME \t %s\n" "$(date "+%H:%M:%S")" "$1 $2"
    else
        printf "[%s] \t $FILE_NAME \t %s\n" "$(date "+%H:%M:%S")" "$1 $2" >> "$DEFAULT_LOG_FILE"
    fi
}

# Parse the script input parameters and save them to global variables
function parseArguments() {
    local arg

    for arg in "$@"; do
        local isParamValid=false

        ##### Help
        if [[ "$arg" =~ ^--help$ ]] || [[ "$arg" =~ ^-h$ ]]; then
            isParamValid=true
            showHelp
            exit 0
        fi

        ##### Verbose - if present log to screen instead of a log file
        if [[ "$arg" =~ ^--verbose$ ]] || [[ "$arg" =~ ^-v$ ]]; then
            VERBOSE=true
            isParamValid=true
        fi

        ##### Assets Source Path - Games Assets Path
        if [[ "$arg" =~ "--source=" ]] || [[ "$arg" =~ "-s=" ]]; then
            argValue="${arg/--source=/}"
            argValue="${argValue/-s=/}"
            if [ -n "$argValue" ]; then
                ASSETS_SOURCE_PATH="$argValue"
                isParamValid=true
            fi
        fi

        if [[ "$isParamValid" == "false" ]] && [[ ! $arg == "" ]]; then
            logMessage "ERROR" "Script execution stopped: Invalid flag name or flag usage: $arg" true
            if [[ $VERBOSE == "true" ]]; then
                showHelp
            fi
            exit 1
        fi
    done

    logMessage "INFO" "Running $FILE_NAME script. For more options run the script with --help or -h flag" true
}

# Validate the script parameters
function validateParamsValues() {
    if [[ -z $ASSETS_SOURCE_PATH ]]; then
        logMessage "ERROR" "Script execution stopped: missing value for --source,-s flag." "true"
        exit 10
    fi
    ASSETS_SOURCE_PATH=$(echo "$ASSETS_SOURCE_PATH" | sed "s/\/$//" ) # remove unwanted trailing /
    logMessage "INFO" " - Using '$ASSETS_SOURCE_PATH' as a source for the games resources. " "true"
}

function __printParamValues__() {
    logMessage "INFO" "Running script: $FILE_NAME with the following parameters: $(printf "%s " "${SCRIPT_ARGUMENTS[@]}")"
    logMessage "INFO" "Value for \$BASEDIR: $BASEDIR"
    logMessage "INFO" "Value for \$SCRIPTS_PATH: $SCRIPTS_PATH"
    logMessage "INFO" "Value for \$ASSETS_SOURCE_PATH: $ASSETS_SOURCE_PATH"
    logMessage "INFO" "----------"
}

# Run all the prerequisites of the csv file generation
function initScript() {
    if ! [[ -d "$TEMP_FOLDER" ]]; then
        mkdir "$TEMP_FOLDER"
    fi
    echo "" > "$DEFAULT_LOG_FILE"

    ##### Parse script arguments #####
    parseArguments "$@"

    ##### Initialize missing required variables with default values #####
    validateParamsValues

    if [[ $VERBOSE == "true" ]]; then
        __printParamValues__
    fi

    ##### Check if the dependencies are installed and configured ok
    if ! "$SCRIPTS_PATH"/checkDependencies.sh "$ASSETS_SOURCE_PATH" "$VERBOSE"; then
        exit 1
    fi

    if ! [[ -d "$TEMP_FOLDER/prismic" ]]; then
        mkdir "$TEMP_FOLDER/prismic"
    fi

    logMessage "INFO" "Copy the latest generate config files from source folder"
    mc cp -r "$ASSETS_SOURCE_PATH/Apps/" "$TEMP_FOLDER/Apps"

    if ! "$SCRIPTS_PATH"/generateRawDataFile.sh "--source=$ASSETS_SOURCE_PATH" ; then
        logMessage "ERROR" "$RAW_DATA_FILE_PATH file could not be generated!"
        exit
    else
        logMessage "INFO" "  - the list of all resources from source repo generated with success"
    fi

    ### Get the data from prismic for EmbeddedGameSampleApp (for prod jurisdictions)
    logMessage "INFO" "Get prismic data for all prod jurisdictions"
    "$SCRIPTS_PATH"/getPrismicData.swift "--apps=1" "--env=prod" >> "$DEFAULT_LOG_FILE"
}
########################################################################################################################
# Script starts from here
initScript "$@"

### Generate a csv file with all the games from the assets repo
"$SCRIPTS_PATH"/generateCSV.swift >> "$DEFAULT_LOG_FILE"
logMessage "INFO" "Running $FILE_NAME script finished. For full logs see the log file: $DEFAULT_LOG_FILE" true
logMessage "INFO" "CSV file with all games generated at this location: $TEMP_FOLDER/allGames.csv" true
open "$TEMP_FOLDER/allGames.csv"
