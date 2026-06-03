#!/bin/bash

#  3.copyGames.sh
#
#   This script copy the game assets into the host project and add tags for each resource.
#
#   Dependent scripts:
#       - checkDependencies.sh  - check for dependencies and try to configure them if missing
#       - copyGames.sh          - copy resources based on a assetsToCopy.json file (downloaded or generated)
#
#  Created by Cosmin Titei on 05/02/2020.
#  Copyright © 2020 PaddyPowerBetfair. All rights reserved.

### Todo
# Script versioning ???
# - move logging to a another file - to be used by all the scripts
# List all the possible on help page - add also details about the error
#       - "ERROR" "Script execution stopped: Invalid Assets source path."
# Update help and code comments
# - maybe migrateProvidersAssets shouldn't iterate trough all source assets and start
#       from the assetsToCopy.json file. It might be faster and a cleaner code.
# search for a nicer solution to read/write project.pbxproj file (test https://github.com/apache/cordova-node-xcode)
###

# Constants
BASEDIR=$(dirname "$0")
FILE_NAME=$(basename "$0")
TEMP_FOLDER="$BASEDIR/temp"
SCRIPTS_PATH="$BASEDIR/GamesManagementScripts"
DEFAULT_LOG_FILE="$TEMP_FOLDER/copyGames.log"

# Defaults values for copy scripts
DEFAULT_TARGET_NAME="tbd_native"
DEFAULT_PROJECT_PATH="$BASEDIR/../../ios"
DEFAULT_PROJECT_NAME="tbd_native"

DEFAULT_SYNC_RESOURCES_SCRIPTS_PATH="$HOME/sync-games-assets.sh"

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

function cleanUp() {
    logMessage "INFO" "Clean-up temp files"
    # rm -rf "$TEMP_FOLDER"
}

########################################################################################################################
function parseArguments() {
    local arg

    # Parse argument that might have default values
    for arg in "$@"; do
        ##### Verbose - if present log to screen instead of a log file
        if [[ "$arg" =~ ^--verbose$ ]] || [[ "$arg" =~ ^-v$ ]]; then
            VERBOSE=true
        fi

        ##### Help
        if [[ "$arg" =~ ^--help$ ]] || [[ "$arg" =~ ^-h$ ]]; then
            HELP=true
            continue
        fi

        ##### Assets Source Path - Games Assets Path
        if [[ "$arg" =~ "--source=" ]] || [[ "$arg" =~ "-s=" ]]; then
            argValue="${arg/--source=/}"
            argValue="${argValue/-s=/}"
            if [ -n "$argValue" ]; then
                ASSETS_SOURCE_PATH="$argValue"
            fi
            continue
        fi

        ##### The name of the target that will contain the assets tags
        if [[ "$arg" =~ "--target-name=" ]]; then
            argValue="${arg/--target-name=/}"
            if [ -n "$argValue" ]; then
                TARGET_NAME="$argValue"
            fi
            continue
        fi

        ##### The name of the project that will contain the assets tags
        if [[ "$arg" =~ "--project-name=" ]]; then
            argValue="${arg/--project-name=/}"
            if [ -n "$argValue" ]; then
                PROJECT_NAME="$argValue"
            fi
            continue
        fi

        ##### The path to the iOS project folder that contains the project.pbxproj file
        if [[ "$arg" =~ "--project-path=" ]]; then
            argValue="${arg/--project-path=/}"
            if [ -n "$argValue" ]; then
                PROJECT_PATH="$argValue"
            fi
            continue
        fi

        # For the rest or the parameters pass the value unchanged
        SCRIPT_ARGUMENTS+=("$arg")
    done

    # Validate the values for the parameters that might have default values
    validateParamsValues

    # Add the validated parameters to the script arguments that will be passed to the main script
    if [[ -n $VERBOSE ]]; then
        SCRIPT_ARGUMENTS+=("--verbose")
    fi
    if [[ -n $HELP ]]; then
        SCRIPT_ARGUMENTS+=("--help")
    fi
    if [[ -n $TARGET_NAME ]]; then
        SCRIPT_ARGUMENTS+=("--target-name=$TARGET_NAME")
    fi
    if [[ -n $PROJECT_NAME ]]; then
        SCRIPT_ARGUMENTS+=("--project-name=$PROJECT_NAME")
    fi
    if [[ -n $PROJECT_PATH ]]; then
        SCRIPT_ARGUMENTS+=("--project-path=$PROJECT_PATH")
    fi
    SCRIPT_ARGUMENTS+=("--source=$ASSETS_SOURCE_PATH")
    SCRIPT_ARGUMENTS+=("--skip-check")

    logMessage "INFO" "Running $FILE_NAME script. For more options run the script with --help or -h flag" true
}

function validateParamsValues() {
    # Check also for GAMING_ASSETS_PATH environment variable to see if it has a value
    if [[ -z $ASSETS_SOURCE_PATH ]]; then # if ASSETS_SOURCE_PATH is empty
        if [[ -n "${GAMING_ASSETS_PATH}" ]]; then # if GAMING_ASSETS_PATH is not empty
            ASSETS_SOURCE_PATH="$GAMING_ASSETS_PATH"
        else
            logMessage "ERROR" "Script execution stopped: missing value for --source,-s flag." "true"
            exit 10
        fi
    fi
    ASSETS_SOURCE_PATH=$(echo "$ASSETS_SOURCE_PATH" | sed "s/\/$//" ) # remove unwanted trailing /
    logMessage "INFO" " - Using '$ASSETS_SOURCE_PATH' as a source for the games resources. " "true"

    PROJECT_NAME=$([ -z "$PROJECT_NAME" ] && echo "$DEFAULT_PROJECT_NAME" || echo "$PROJECT_NAME") # if PROJECT_NAME not provided, assign default
    TARGET_NAME=$([ -z "$TARGET_NAME" ] && echo "$DEFAULT_TARGET_NAME" || echo "$TARGET_NAME") # if $TARGET_NAME not provided, assign default
    PROJECT_PATH=$([ -z "$PROJECT_PATH" ] && echo "$DEFAULT_PROJECT_PATH" || echo "$PROJECT_PATH") # if PROJECT_PATH not provided, assign default
}

function __printParamValues__() {
    logMessage "INFO" "Running script: $FILE_NAME with the following parameters: $(printf "%s " "${SCRIPT_ARGUMENTS[@]}")"
    logMessage "INFO" "Value for \$BASEDIR: $BASEDIR"
    logMessage "INFO" "Value for \$SCRIPTS_PATH: $SCRIPTS_PATH"
    logMessage "INFO" "----------"
}

##### Parse script arguments, init
function initScript() {
    if ! [[ -d "$TEMP_FOLDER" ]]; then
        mkdir "$TEMP_FOLDER"
    fi
    echo "" > "$DEFAULT_LOG_FILE"

    ##### Parse script arguments#####
    parseArguments "$@"

    if [[ $VERBOSE == "true" ]]; then
        __printParamValues__
    fi

    # Do a resource sync if needed
    if [[ "$GAMING_ASSETS_PATH" == "$ASSETS_SOURCE_PATH" ]]; then
        if [ -s "$DEFAULT_SYNC_RESOURCES_SCRIPTS_PATH" ]; then # True if file exists and has a size greater than zero
            logMessage "INFO" "Running $DEFAULT_SYNC_RESOURCES_SCRIPTS_PATH sync script" true
            /bin/bash "$DEFAULT_SYNC_RESOURCES_SCRIPTS_PATH" --no-spinner
        fi
    fi

    ##### Check if the dependencies are installed and configured ok
    if ! "$SCRIPTS_PATH"/checkDependencies.sh "$ASSETS_SOURCE_PATH" "$VERBOSE"; then
        exit 1
    fi

    # Run the main copy script with the updated arguments
    if ! "$SCRIPTS_PATH"/copyGames.sh "${SCRIPT_ARGUMENTS[@]}"; then
        exit 1
    fi
    #cleanUp
}

########################################################################################################################
# Script starts from here
initScript "$@"

logMessage "INFO" "Running $FILE_NAME script finished. For full logs see the log file: $DEFAULT_LOG_FILE" true
