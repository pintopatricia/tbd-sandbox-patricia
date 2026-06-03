#!/bin/bash

#  2.parseCSV.sh
#
#   This script parse an allGames.csv CSV file with all the games available on our games assets repo and
#   generate a pair of gamesList.json and assetsToCopy.json files for each application.
#   In order to build this file we need a allGames.csv file filled and some data from Prismic (for display name of
#   the games internal codes) and the list of all the assets from our games assets repo.
#
#   Dependent scripts:
#       - checkDependencies.sh  - check for dependencies and try to configure them if missing
#       - getPrismicData.swift  - needed for display name and internal codes of the games
#       - parseCsvFile.swift    - parse csv file and generate config files
#
#  Created by Cosmin Titei on 05/02/2020
#  Copyright © 2020 PaddyPowerBetfair. All rights reserved.

###### Todo
# 1. Error Handling:
#     - use different error codes for different errors
#     - reuse some codes also for other scripts for the same errors

ALL_APPLICATIONS=(
    [1]="EmbeddedGameSampleApp"
    [3]="tbd_native"
    [4]="BFVegasRO"
    [5]="BFCasino"
    [6]="PPSportsbook"
    [7]="PPGames"
    [8]="SkyBet"
    [9]="SkyCasino"
    [10]="SkyVegas"
)

BASEDIR=$(dirname "$0")
TEMP_FOLDER="$BASEDIR/temp"
SCRIPTS_PATH="$BASEDIR/GamesManagementScripts"

# Defaults
DEFAULT_LOG_FILE="$TEMP_FOLDER/copyGames.log"
REMOTE_CONFIGS_FOLDER="Apps"
REMOTE_CONFIGS_BACKUPS_FOLDER="AppsConfigsBackUp"
DEFAULT_APPLICATION="tbd_native"
FILE_NAME=$(basename "$0")
########################################################################################################################
function showHelp() {
    ##### Usage #####
    printf "USAGE:\n  %s [FLAGS]\n\n" "$0"

    ##### Flags #####
    printf "FLAGS:\n"
    printf "  --app, -a                 the Application for which we generate configs. (See APPLICATION section for more details)\n"
    printf "  --upload-destination, -d  the destination where to upload the generated configs, can be a local or remote folder \n"
    printf "  --odr-split               use split resources for the games that have it available \n"
    printf "  --verbose                 if present it will print the logs on the screen instead of the %s file \n" "$DEFAULT_LOG_FILE"
    printf "  --help, -h                show help\n"
    printf "\n\n\n"

    ##### Application #####
    printf "APPLICATION\n"
    printf "  This flag  is used to select the application column in the allGames.csv file in order to generate the configs \n"
    printf "  The valid values for this flag are: \n"
    printf "    "
    printf "'%s', " "${ALL_APPLICATIONS[@]}"
    printf "\n  If this flag has no value the default value %s is used. \n" "$DEFAULT_APPLICATION"
    printf "\n\n"
    printf "You can check also https://flutteruki.atlassian.net/wiki/x/Ai-FB for more details\n\n"

    ##### Examples #####
    printf "EXAMPLES:\n"

    printf "  0. Showing the help .\n"
    printf "        ./2.parseCSV.sh -h \n"
    printf "        ./2.parseCSV.sh --help \n"
    printf "  1. Generate configs for Betfair Rebuild application with odr split .\n"
    printf "        ./2.parseCSV.sh --app=tbd_native --odr-split\n"
    printf "  1. Generate configs for Betfair Casino application and also upload configs.\n"
    printf "        ./2.parseCSV.sh --app=BFCasino --upload-destination=awsbf/gosw-games-assets-bf-dev/ \n"

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

        ##### should use odr split
        if [[ "$arg" =~ ^--odr-split$ ]]; then
            ODR_SPLIT=true
            isParamValid=true
        fi

        ##### Application
        if [[ "$arg" =~ "--app=" ]] || [[ "$arg" =~ ^-a= ]]; then
            argValue="${arg/--app=/}"
            argValue="${argValue/-a=/}"

            if [[ " ${ALL_APPLICATIONS[*]} " =~ " $argValue " ]]; then
                APPLICATION="$argValue"
                isParamValid=true
            fi
        fi

        ##### Assets Configs Destination Path - Games Assets Path
        if [[ "$arg" =~ "--upload-destination=" ]] || [[ "$arg" =~ "-d=" ]]; then
            argValue="${arg/--upload-destination=/}"
            argValue="${argValue/-d=/}"
            if [ -n "$argValue" ]; then
                ASSETS_DESTINATION_PATH="$argValue"
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

        SCRIPT_ARGUMENTS+=("$arg")
    done

    logMessage "INFO" "Running $FILE_NAME script. For more options run the script with --help or -h flag" true
}

# Validate the script parameters
function validateParamsValues() {
    ASSETS_DESTINATION_PATH=$(echo "$ASSETS_DESTINATION_PATH" | sed "s/\/$//" ) # remove unwanted trailing /
    if [[ -z $ASSETS_DESTINATION_PATH ]]; then
        UPLOAD="false"
    else
        logMessage "INFO" " - Using '$ASSETS_DESTINATION_PATH' as upload destination for the generated configs. " "true"
        UPLOAD="true"
    fi

    APPLICATION=$( [ -z "$APPLICATION" ] && echo "$DEFAULT_APPLICATION" || echo "$APPLICATION")
    UPLOAD=$( [ -z "$UPLOAD" ] && echo "false" || echo "$UPLOAD")
    ODR_SPLIT=$( [ -z "$ODR_SPLIT" ] && echo "false" || echo "$ODR_SPLIT")
    APPS_CONFIGS_DESTINATION_PATH="$ASSETS_DESTINATION_PATH/$REMOTE_CONFIGS_FOLDER"
    APPS_CONFIGS_BACKUPS_DESTINATION_PATH="$ASSETS_DESTINATION_PATH/$REMOTE_CONFIGS_BACKUPS_FOLDER"
    for index in "${!ALL_APPLICATIONS[@]}"; do
        if [[ "$APPLICATION" == "${ALL_APPLICATIONS[index]}" ]]; then
            APPLICATION_INDEX=$index
        fi
    done

    if [[ "$APPLICATION" == "${ALL_APPLICATIONS[index]}" ]]; then
        APPLICATION_INDEX=$index
    fi
}
function __printParamValues__() {
    logMessage "INFO" "Running script: $FILE_NAME with the following parameters: $(printf "%s " "${SCRIPT_ARGUMENTS[@]}")"
    logMessage "INFO" "Value for \$BASEDIR: $BASEDIR"
    logMessage "INFO" "Value for \$SCRIPTS_PATH: $SCRIPTS_PATH"
    logMessage "INFO" "Value for \$ASSETS_SOURCE_PATH: $ASSETS_SOURCE_PATH"
    logMessage "INFO" "Value for \$APPLICATION: $APPLICATION"
    logMessage "INFO" "Value for \$APPLICATION_INDEX: $APPLICATION_INDEX"
    logMessage "INFO" "Value for \$UPLOAD: $UPLOAD"
    logMessage "INFO" "Value for \$ODR_SPLIT: $ODR_SPLIT"
}

# Run all the prerequisites of the csv file generation
function initScript() {
    # checking for the allGames.csv file
    if ! [[ -s "$TEMP_FOLDER/allGames.csv" ]]; then
        logMessage "ERROR" "Script execution stopped: there is no allGames.csv file in the temp folder. Please copy one and run the script again!"  true
        exit 1
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
    if ! "$SCRIPTS_PATH"/checkDependencies.sh "$ASSETS_DESTINATION_PATH"; then
        exit 1
    fi

    if ! [[ -d "$TEMP_FOLDER/prismic" ]]; then
        mkdir "$TEMP_FOLDER/prismic"
    fi

    logMessage "INFO" "Get prismic data for $APPLICATION:$APPLICATION_INDEX" true
    "$SCRIPTS_PATH"/getPrismicData.swift "--apps=$APPLICATION_INDEX" "--env=prod" >> "$DEFAULT_LOG_FILE"
}
########################################################################################################################
# Script starts from here
initScript "$@"

logMessage "INFO" "Generating configs for $APPLICATION:$APPLICATION_INDEX" true
if [[ $ODR_SPLIT == "true" ]]; then
    odrSplitFlag="--odr-split"
fi
"$SCRIPTS_PATH"/parseCsvFile.swift "--apps=$APPLICATION_INDEX" "$odrSplitFlag"
logMessage "INFO" "Files $APPLICATION-assetsToCopy.json and $APPLICATION-gamesList.json saved in the $TEMP_FOLDER folder." true

if [[ "$UPLOAD" == "true" ]]; then
    ### Upload new configs on games-assets server
    mc cp "$TEMP_FOLDER/$APPLICATION-assetsToCopy.json" "$APPS_CONFIGS_DESTINATION_PATH/$APPLICATION/assetsToCopy.json"
    mc cp "$TEMP_FOLDER/$APPLICATION-gamesList.json" "$APPS_CONFIGS_DESTINATION_PATH/$APPLICATION/gamesList.json"

    ### Upload new configs backup on games-assets server
    BACKUP_FOLDER="backup_$(date +%Y.%m.%d_%H.%M)"
    BACKUP_FOLDER_PATH="$APPS_CONFIGS_BACKUPS_DESTINATION_PATH/$APPLICATION/$BACKUP_FOLDER"
    mc cp "$TEMP_FOLDER/$APPLICATION-assetsToCopy.json" "$BACKUP_FOLDER_PATH/assetsToCopy.json"
    mc cp "$TEMP_FOLDER/$APPLICATION-gamesList.json" "$BACKUP_FOLDER_PATH/gamesList.json"
    mc cp "$TEMP_FOLDER/allGames.csv" "$BACKUP_FOLDER_PATH/allGames.csv"
else
    logMessage "INFO" "If you want to upload the generated data to games assets repo use also --upload-destination flag." true
    open ./temp
fi
