#!/bin/bash

#  generateConfigs.sh
#
#  Created by Cosmin Titei on 23/01/2020.
#  Copyright © 2020 PaddyPowerBetfair. All rights reserved.

ALL_PROVIDERS=(Blueprint Evolution EveryMatrix GGN GPAS IGT Inspired Playtech PlayNGo Pragmatic Relax RtCay)
ODR_FOLDER_NAME="GamesOnDemandResources"

# Defaults
BASEDIR=$(dirname "$0")
FILE_NAME=$(basename "$0")
TEMP_FOLDER="$BASEDIR/../temp"
INSTALLED_GAMES=()
DEFAULT_LOG_FILE="$TEMP_FOLDER/copyGames.log"

########################################################################################################################
function showHelp() {
    ##### Usage #####
    printf "USAGE:\n  %s [FLAGS]\n\n" "$FILE_NAME"

    ##### Flags #####
    printf "FLAGS:\n"
    printf "  --providers, -p       generate configs only for one or more game providers. (See PROVIDERS)\n"
    printf "  --games, -p           generate configs filtered by rgs game codes. (See GAMES)\n"
    printf "  --source              Required, the path to the game assets. This flag is required and can be a path to a local folder or to a remote bucket.\n"
    printf "  --destination         Required, the path to the Resources folder where '%s' folder will be created and\n" "$ODR_FOLDER_NAME"
    printf "                        where all the assets will be added. This is needed to scan for already installed games \n"
    printf "                        and append the new games to this list. Default value is '%s'\n" "$ODR_FOLDER_NAME"
    printf "  --force               if this flag is present then the script will do a cleanup of the generated files\n"
    printf "                        so that the script will fetch fresh data\n"
    printf "  --help, -h            show help\n"
    printf "\n\n\n"

    ##### Providers #####
    printf "PROVIDERS\n"
    printf "  This flag is used to filter all game based on the provided providers. The values for the --provider, -p\n"
    printf "  flag can be one or more form the following: "
    printf "'%s', " "${ALL_PROVIDERS[@]}"
    printf "\n  If this flag has no value or is not present then the games are not filtered by providers. \n"
    printf "\n\n"

    ##### Games #####
    printf "GAMES\n"
    printf "  This flag has as value game rgs codes separated by comma. If the flag is present and has values then \n"
    printf "  the list of games is filtered by those games. \n"
    printf "\n\n"

    ##### Examples #####
    printf "EXAMPLES:\n"

    printf "  1. Generate config files for sample app with all the games.\n"
    printf "        ./generateConfigs.sh --source=awsbf/gosw-games-assets-bf-dev --destination=./../../../EmbeddedGameSampleApp/Resources/GamesOnDemandResources \n"
    printf "  2. Generate config files for Playtech games.\n"
    printf "        ./generateConfigs.sh --source=awsbf/gosw-games-assets-bf-dev --destination=./../../../EmbeddedGameSampleApp/Resources/GamesOnDemandResources --providers=Playtech --verbose --skip-live \n"
    printf "  3. Generate config files for Relax games from a custom source, split resources and also\n"
    printf "    force a cleanup of the temp folder in order to retrieve fresh data.\n"
    printf "        ./generateConfigs.sh --source=/Users/usr1/games-assets --destination=./../../../EmbeddedGameSampleApp/Resources/GamesOnDemandResources --providers=Relax --verbose --skip-live --odr-split \n"
    printf "\n\n"

    ##### END #####
    printf "\n\n\n"
}

########################################################################################################################
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

        ##### Skip MinIO check
        if [[ "$arg" =~ ^--skip-check$ ]]; then
            SKIP_CHECK=true
            isParamValid=true
        fi

        ##### Skip MinIO check
        if [[ "$arg" =~ ^--skip-live$ ]]; then
            SKIP_LIVE_GAMES=true
            isParamValid=true
        fi

        ##### should use odr split
        if [[ "$arg" =~ ^--odr-split$ ]]; then
            ODR_SPLIT=true
            isParamValid=true
        fi

        ##### Force
        if [[ "$arg" =~ ^--force$ ]] || [[ "$arg" =~ ^-f$ ]]; then
            FORCE=true
            isParamValid=true
        fi

        ##### Providers
        if [[ "$arg" =~ "--providers=" ]] || [[ "$arg" =~ ^-p= ]]; then
            argValue="${arg/--providers=/}"
            argValue="${argValue/-p=/}"

            if [ -n "$argValue" ]; then
                IFS=',' read -r -a PROVIDERS <<< "$argValue"
                isParamValid=true
            fi
        fi

        ##### Games
        if [[ "$arg" =~ "--games=" ]] || [[ "$arg" =~ ^-g= ]]; then
            argValue="${arg/--games=/}"
            GAMES="${argValue/-g=/}"
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

        ##### Assets Destination Path - The path to the Resources folder that will contain the On Demand Resources folder
        if [[ "$arg" =~ "--destination=" ]]; then
            argValue="${arg/--destination=/}"
            if [ -n "$argValue" ]; then
                ODR_FOLDER_PATH="${argValue/%\//}"
                isParamValid=true
            fi
        fi

        if [[ "$isParamValid" == "false" ]] && [[ ! $arg == "" ]]; then
            printf '  Script execution stopped: Invalid flag name or flag usage: "%s" \n\n\n' "$arg" true
            # showHelp
            exit 1
        fi
    done

    logMessage "INFO" "Running $FILE_NAME script. For more options run the script with --help or -h flag"
}

function validateParamsValues() {
    if [[ -z $ASSETS_SOURCE_PATH ]]; then
        logMessage "ERROR" "Script execution stopped: missing value for --source,-s flag." "true"
        exit 10
    fi

    if [[ -z $ODR_FOLDER_PATH ]]; then
        logMessage "ERROR" "Script execution stopped: missing value for --destination flag." true
        exit 10
    fi

    ASSETS_SOURCE_PATH=$(echo "$ASSETS_SOURCE_PATH" | sed "s/\/$//" ) # remove unwanted trailing /
    PROVIDERS=$( [ -z "$PROVIDERS" ] && echo "" || echo "$PROVIDERS")
    GAMES=$( [ -z "$GAMES" ] && echo "" || echo "$GAMES")
    APPLICATION="1"
    FORCE=$( [ -z "$FORCE" ] && echo "false" || echo "$FORCE")
    SKIP_LIVE_GAMES=$( [ -z "$SKIP_LIVE_GAMES" ] && echo "false" || echo "$SKIP_LIVE_GAMES")
    ODR_SPLIT=$( [ -z "$ODR_SPLIT" ] && echo "false" || echo "$ODR_SPLIT")
}

function initScript() {
    ##### Parse script arguments #####
    parseArguments "$@"

    ##### Initialize missing required variables with default values #####
    validateParamsValues

    if [[ "$FORCE" == "true" ]]; then
        ### Trigger a clean up in order to force to retrieve all the required data again
        cleanUp
    fi

    ##### Check if minio CLI is installed and configured ok
    if [[ $SKIP_CHECK != "true" ]]; then
        if ! "$BASEDIR"/checkDependencies.sh "$ASSETS_SOURCE_PATH" "$VERBOSE"; then
          exit 1
        fi
    fi

    # Create temp folders
    if ! [[ -d "$TEMP_FOLDER" ]]; then
        mkdir "$TEMP_FOLDER"
    fi

    if ! [[ -d "$TEMP_FOLDER/prismic" ]]; then
        mkdir "$TEMP_FOLDER/prismic"
    fi

    # Parse the ODR folder for already copied games
    if [[ -d "$ODR_FOLDER_PATH" ]]; then
        getInstalledGames
    fi

    if [[ $VERBOSE == "true" ]]; then
        __printParamValues__
    fi
}

########################################################################################################################
# Logging function
function logMessage() {
    if [[ $VERBOSE == "true" ]] || [[ $3 == "true" ]]; then
        printf "[%s] \t $FILE_NAME \t %s\n" "$(date "+%H:%M:%S")" "$1 $2"
    else
        printf "[%s] \t $FILE_NAME \t %s\n" "$(date "+%H:%M:%S")" "$1 $2" >> "$DEFAULT_LOG_FILE"
    fi
}

function listFolder() {
    mc ls --json "$1" | tr "\n" " " | sed "s/} {/},{/g" | sed "s/^{/[{/" | sed "s/} $/}]/" | jq '.[].key' | tr -d '"' | tr -d "/"
}

function __printParamValues__() {
    logMessage "INFO" "Running script: $FILE_NAME with the following parameters:"
    logMessage "INFO" "Value for \$BASEDIR: $BASEDIR"
    logMessage "INFO" "Value for \$ASSETS_SOURCE_PATH: $ASSETS_SOURCE_PATH"
    logMessage "INFO" "Value for \$ODR_FOLDER_PATH: $ODR_FOLDER_PATH"
    logMessage "INFO" "Value for \$PROJECT_NAME: $PROJECT_NAME"
    logMessage "INFO" "Value for \$TARGET_NAME: $TARGET_NAME"
    logMessage "INFO" "Value for \$FORCE: $FORCE"
    logMessage "INFO" "Value for \$SKIP_LIVE_GAMES: $SKIP_LIVE_GAMES"
    logMessage "INFO" "Value for \$ODR_SPLIT: $ODR_SPLIT"
    logMessage "INFO" "Value for \$PROVIDERS: $( IFS=$' '; echo "${PROVIDERS[@]}" )"
    logMessage "INFO" "Value for \$GAMES: $( IFS=$' '; echo "${GAMES[@]}" )"
    logMessage "INFO" "Value for \$INSTALLED_GAMES: $( IFS=$' '; echo "${INSTALLED_GAMES[@]}" )"
    logMessage "INFO" "----------"
}

########################################################################################################################
# Function that prints the RGS code of the game and writes it in the gamesList.json file
function getInstalledGames() {
    logMessage "INFO" "parse $ODR_FOLDER_PATH for games"
    local -a allGameIds
    local game

    for provider in $(listFolder "$ODR_FOLDER_PATH"); do
        local gamesAssetsFilter="\.zip$"
        local commonAssetsFilter="*"
        local isValidProvider=true

        case $provider in

        Blueprint)
            gamesAssetsFilter="^BP_[a-zA-Z0-9]*\.zip$"
            ;;

        RtCay)
            gamesAssetsFilter="^games.[A-Z][a-zA-Z.]*\.zip$"
            ;;

        Playtech)
            commonAssetsFilter="^$provider.(platform|common)"
            ;;
        IGT)
            gamesAssetsFilter="^[0-9]{3}\-[0-9]{4}\-[0-9]{3}.zip$"
            ;;
        GPAS)
            gamesAssetsFilter="^gpas_[0-9a-zA-Z]+_pop.zip$"
            ;;
        Pragmatic)
            gamesAssetsFilter="^[a-z0-9A-Z_]*\.zip$"
            ;;
        Inspired)
            gamesAssetsFilter="^[a-z0-9A-Z_-]*\.zip$"
            ;;
        Relax)
            gamesAssetsFilter="^[a-z0-9A-Z_\.-]*\.zip$"
            ;;
        PlayNGo)
            gamesAssetsFilter="^[a-z0-9A-Z_\.-]*\.zip$"
            ;;
        EveryMatrix)
            gamesAssetsFilter="^[a-z0-9A-Z_\.-]*\.zip$"
            ;;
        GGN)
            gamesAssetsFilter="^[0-9]+-[0-9]+\.zip$"
            ;;
        #TODO: extend cases when others Providers are integrated
        *)
            isValidProvider=false
            ;;
        esac

        if [ "$isValidProvider" = true ]; then
            for gameFormat in $(listFolder "$ODR_FOLDER_PATH/$provider/" | grep -E "$gamesAssetsFilter" | grep -v "$commonAssetsFilter"); do
                if [ -s "$ODR_FOLDER_PATH/$provider/$gameFormat" ]; then
                    ###### The file exists and has a size greater than zero.
                    game="$(echo "$gameFormat" | sed \
                        -e 's/^games\.//' \
                        -e 's/\.da\.zip$//' -e 's/\_da\.zip$//' -e 's/\.da\-DK\.zip$//' \
                        -e 's/\.de\.zip$//' -e 's/\_de\.zip$//' -e 's/\.de\-DE\.zip$//' \
                        -e 's/\.en\.zip$//' -e 's/\_en\.zip$//' -e 's/\.en\-GB\.zip$//' \
                        -e 's/\.es\.zip$//' -e 's/\_es\.zip$//' -e 's/\.es\-ES\.zip$//' \
                        -e 's/\.it\.zip$//' -e 's/\_it\.zip$//' -e 's/\.it\-IT\.zip$//' \
                        -e 's/\.pt\.zip$//' -e 's/\_pt\.zip$//' -e 's/\.pt\-BR\.zip$//' \
                        -e 's/\.ro\.zip$//' -e 's/\_ro\.zip$//' -e 's/\.ro\-RO\.zip$//' \
                        -e 's/\.ru\.zip$//' -e 's/\_ru\.zip$//' -e 's/\.ru\-RU\.zip$//' \
                        -e 's/\.sv\.zip$//' -e 's/\_sv\.zip$//' -e 's/\.sv\-SE\.zip$//' \
                        -e 's/\.bare\.zip$//' \
                        -e 's/\.assets\.zip$//' \
                        -e 's/\.zip$//')"
                    allGameIds+=("$game")
                fi
            done
        fi
    done

    # Eliminate duplicate id's
    INSTALLED_GAMES=($(echo "${allGameIds[@]}" | tr "[:space:]" '\n' | awk '!a[$0]++'))
}

function join {
    local IFS="$1"
    shift
    echo "$*"
}

########################################################################################################################
# Function that save all the tags to on-demand-resources-tags.json
function cleanUp() {
    logMessage "INFO" "Clean up temp files"
    rm -rf "$TEMP_FOLDER"
}

# When generating custom games list configs (using-o=add operation on CopyGame), if the used assets source does
#   not contain all the hardcoded common files we will remove them from assetToCopy.json file in order to not fail
#   the copyGames script run when trying to copy missing files.
function removeMissingCommonFiles() {
    local assetsToCopyFile
    local -a providers

    assetsToCopyFile="$TEMP_FOLDER/EmbeddedGameSampleApp-assetsToCopy.json"
    assetsToCopyFileTemp="$TEMP_FOLDER/EmbeddedGameSampleApp-assetsToCopy-temp.json"
    providers=$(jq -r 'keys[]' < "$assetsToCopyFile")

    for provider in $providers; do
        providerCommon=$(jq -r --arg keyProvider "$provider" '.[$keyProvider] | .common' < "$assetsToCopyFile")
        if [ "$providerCommon" != "null" ]; then
          providerCommonAssets=$(echo "$providerCommon" | jq -r 'keys[]')
          for commonAsset in $providerCommonAssets; do
              fileExist=$(jq -r --arg file "$provider/Common/$commonAsset"  '.[] | select (.key | . == $file) | .key' < "$TEMP_FOLDER/raw-data.json")
              if [[ -z $fileExist ]]; then
                  logMessage "WARN" "  - the file $provider/Common/$commonAsset is not in the source and it will be removed from configs"
                  jq --arg keyProvider "$provider" --arg keyFile "$commonAsset" 'del(.[$keyProvider].common[$keyFile])' "$assetsToCopyFile" > "$assetsToCopyFileTemp" && mv "$assetsToCopyFileTemp" "$assetsToCopyFile"
              fi
          done
        fi
    done
}

########################################################################################################################
# Script starts from here
initScript "$@"

### Generate raw-data.json with all the resources from the assets repo
# TODO - check for error on raw-data.json file
# TODO - do a force update in case of outdated data !!!
if ! "$BASEDIR"/generateRawDataFile.sh "--source=$ASSETS_SOURCE_PATH" -v ; then
    logMessage "ERROR" "$TEMP_FOLDER/raw-data.json file could not be generated!"
    exit 10
else
    logMessage "INFO" "  - the list of all resources from source repo generated with success"
fi

if [ ! -s "$TEMP_FOLDER/prismic/EmbeddedGameSampleApp.json" ]; then
    ### Get the data from prismic for SampleApp (=all prismic repos and all environments)
    "$BASEDIR"/getPrismicData.swift "--apps=$APPLICATION"
fi

### Generate a csv file with all the games from the assets repo
"$BASEDIR"/generateCSV.swift

if [[ $SKIP_LIVE_GAMES == "true" ]]; then
    shouldSkipLiveGames="--skip-live"
fi

if [[ $ODR_SPLIT == "true" ]]; then
    shouldUseOdrSplitFlag="--odr-split"
fi

logMessage "INFO" "Parse CSV file: with parameters:  --apps=$APPLICATION --providers=$(join , "${PROVIDERS[@]}") --games=$GAMES --installed-games=$(join , "${INSTALLED_GAMES[@]}")"
if "$BASEDIR"/parseCsvFile.swift "--apps=$APPLICATION" "--providers=$(join , "${PROVIDERS[@]}")" "--games=$GAMES" "--installed-games=$(join , "${INSTALLED_GAMES[@]}")" "$shouldSkipLiveGames" "$shouldUseOdrSplitFlag"; then
    ## todo - clean-up the assets to copy based on the source ??
    removeMissingCommonFiles

    mv -f "$TEMP_FOLDER/EmbeddedGameSampleApp-assetsToCopy.json" "$TEMP_FOLDER/assetsToCopy.json"
    mv -f "$TEMP_FOLDER/EmbeddedGameSampleApp-gamesList.json" "$TEMP_FOLDER/gamesList.json"
else
    logMessage "ERROR" "Cannot generate configs for the parameters: with parameters:  --apps=$APPLICATION --providers=$(join , "${PROVIDERS[@]}") --games=$GAMES --installed-games=$(join , "${INSTALLED_GAMES[@]}") \n see error above"
    exit 1
fi

# cleanUp
