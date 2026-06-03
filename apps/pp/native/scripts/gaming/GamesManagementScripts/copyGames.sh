#!/bin/bash

### TODO
# define specific error codes foe each error type
# comment code
# fix the issues with the script launched from another location# update help - required params!!
#
# Errors
# parseArguments
# "Script execution stopped: Invalid flag name or flag usage: '$arg'"
# ValidateParams
# "Script execution stopped: missing value for --target-name flag."
# "Script execution stopped: missing value for --project-name flag."

ALL_PROVIDERS=(Blueprint EveryMatrix Evolution GGN GPAS IGT Inspired PlayNGo Playtech Pragmatic Relax RtCay)
ALL_OPERATIONS=(touch copy add)
ODR_FOLDER_NAME="GamesOnDemandResources"

# Defaults
BASEDIR=$(dirname "$0")
FILE_NAME=$(basename "$0")
TEMP_FOLDER="$BASEDIR/../temp"
DEFAULT_PROVIDER=ALL
DEFAULT_OPERATION="copy"
DEFAULT_NUMBER_OF_RETRIES=3
DEFAULT_LOG_FILE="$TEMP_FOLDER/copyGames.log"

# Saved commands
sed_command='sed -i ""'
plistBuddy="/usr/libexec/PlistBuddy"

########################################################################################################################
function showHelp() {
    ##### Usage #####
    printf "USAGE:\n  %s [FLAGS]\n\n" "$0"

    ##### Flags #####
    printf "FLAGS:\n"
    printf "  --operation, -o       the operation that will be applied to the assets. (See OPERATIONS)\n\n"
    printf "  --providers, -p       filter assets based on one or more game provider, separated by comma. (See PROVIDERS)\n"
    printf "  --games, -p           filter assets based on rgs game codes. (See GAMES)\n"
    printf "  --source              the path to the game assets. This flag is required and can be a path to a local folder or to a remote bucket. \n"
    printf "  --target-name         the name of the target that will contain all the assets. Default value is '%s'\n" "$DEFAULT_TARGET_NAME"
    printf "  --project-path        the path to the folder containing the project folder \n"
    printf "  --project-name        the name of the project folder that which contains the Resources folder into which\n"
    printf "                        will be added the assets. Default value is '%s'\n\n" "$DEFAULT_PROJECT_NAME"
    printf "  --force               if this flag is present then the script will do a cleanup of the generated files\n"
    printf "                        so that the script will fetch fresh data\n"
    printf "  --verbose             if present it will print the logs on the screen instead of the %s file \n" "$DEFAULT_LOG_FILE"
    printf "  --help, -h            show help\n"
    printf "  --unique-tags, -ut    use unique tags for games resources - to be used mainly for testflight/appstore builds.\n
                                    To achieve this, the app version and build number will be used to compose the tags versioning suffix\n
                                    of resources\n"
    printf "You can check also https://flutteruki.atlassian.net/wiki/x/rWHFB for more details\n\n\n"

    ##### Operations #####
    printf "OPERATIONS\n"
    printf "  The available values for the --operations, -o flag are: "
    printf "'%s', " "${ALL_OPERATIONS[@]}"
    printf "with the default value: '%s'\n\n" "$DEFAULT_OPERATION"
    printf "    - touch             with this operation will ADD all the assets listed in the assetsToCopy.json file\n"
    printf "                        (located on the assets domain) to the %s folder and also added to \n" "$ODR_FOLDER_NAME"
    printf "                        the project.pbxproj file. The file will NOT be copied to the %s\n" "$ODR_FOLDER_NAME"
    printf "                        folder instead empty files will be created.\n\n"
    printf "    - copy              with this operation will COPY all the assets listed in the assetsToCopy.json file\n"
    printf "                        (located on the assets domain) to the %s folder and also added to \n" "$ODR_FOLDER_NAME"
    printf "                        the project.pbcproj file.\n\n"
    printf "    - add               with this operation will COPY all the assets found on the assets domain\n"
    printf "                        to the %s folder and also added to the project.pbcproj file.\n" "$ODR_FOLDER_NAME"
    printf "                        This flag is used together other flags like --providers and/or --games in order\n"
    printf "                        to filter the list of games resources to be added to project. If none of those the \n"
    printf "\n\n"

    ##### Providers #####
    printf "PROVIDERS\n"
    printf "  This flag is used to filter all game based on the provided providers. The values for the --provider, -p\n"
    printf "  flag can be one or more form the following: "
    printf "'%s', " "${ALL_PROVIDERS[@]}"
    printf "\n  If this flag has no value or is not present then the games are not filtered by providers. \n"
    printf "  This flag has an effect only if the value for --operation flag is 'add', for the 'copy' or 'touch'\n"
    printf "  this flag is ignored\n"
    printf "\n\n"

    ##### Games #####
    printf "GAMES\n"
    printf "  This flag has as value game rgs codes separated by comma. If the flag is present and has values then \n"
    printf "  the list of games is filtered by those games. \n"
    printf "  This flag has an effect only if the value for --operation flag is 'add', for the 'copy' or 'touch'\n"
    printf "  this flag is ignored\n"
    printf "\n\n"

    ##### Examples #####
    printf "EXAMPLES:\n"
    printf "  1. Add the games from the list saved on the games assets server using default target and project names\n"
    printf "        ./copyGames.sh -o=copy\n"
    printf "  2. Add the games from the list saved on the games assets server but overwrite the default target\n"
    printf "        ./copyGames.sh -o=copy --target-name=BetfairSportsbook\n"
    printf "  3. Add the games from the list saved on the games assets server but overwrite the default target and project names\n"
    printf "        ./copyGames.sh -o=copy --target-name=BetfairSportsbook --project-name=BFSportsbook\n"
    printf "  4. Add all the games from RtCay provider\n"
    printf "        ./copyGames.sh -o=add -p=RtCay \n"
    printf "  5. Add only the 'RoulettePremium2018' and '200-1278-002' games \n"
    printf "        ./copyGames.sh -o=add --games=RoulettePremium2018,200-1278-002 \n"
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

        ##### Force
        if [[ "$arg" =~ ^--force$ ]] || [[ "$arg" =~ ^-f$ ]]; then
            FORCE=true
            isParamValid=true
        fi

        ##### Skip MinIO check
        if [[ "$arg" =~ ^--skip-check$ ]]; then
            SKIP_CHECK=true
            isParamValid=true
        fi

        ##### Do a cleanup of the Xcode project of existing ODR files and configs
        if [[ "$arg" =~ ^--cleanup$ ]]; then
            CLEAN_UP=true
            isParamValid=true
        fi

        ##### Operation
        if [[ "$arg" =~ ^--operation= ]] || [[ "$arg" =~ ^-o= ]]; then
            argValue="${arg/--operation=/}"
            argValue="${argValue/-o=/}"

            if [[ " ${ALL_OPERATIONS[*]} " =~ " $argValue " ]]; then
                OPERATION="$argValue"
                isParamValid=true
            fi
        fi

        ##### Providers
        if [[ "$arg" =~ "--providers=" ]] || [[ "$arg" =~ ^-p= ]]; then
            argValue="${arg/--providers=/}"
            argValue="${argValue/-p=/}"

            if [ -n "$argValue" ]; then
                PROVIDERS_FOR_PARSE_CSV="$argValue"
                isParamValid=true
            fi
        fi

        ##### Games
        if [[ "$arg" =~ "--games=" ]] || [[ "$arg" =~ ^-g= ]]; then
            argValue="${arg/--games=/}"
            GAMES="${argValue/-g=/}"
            isParamValid=true
        fi

        ##### should use odr split
        if [[ "$arg" =~ ^--odr-split$ ]]; then
            ODR_SPLIT=true
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

        ##### The name of the target that will contain the assets tags
        if [[ "$arg" =~ "--target-name=" ]]; then
            argValue="${arg/--target-name=/}"
            if [ -n "$argValue" ]; then
                TARGET_NAME="$argValue"
                isParamValid=true
            fi
        fi

        ##### The path to the iOS project folder that contains the project.pbxproj file
        if [[ "$arg" =~ "--project-path=" ]]; then
            argValue="${arg/--project-path=/}"
            if [ -n "$argValue" ]; then
                PROJECT_PATH="$argValue"
                isParamValid=true
            fi
            continue
        fi

        ##### The name of the target that will contain the assets tags
        if [[ "$arg" =~ "--project-name=" ]]; then
            argValue="${arg/--project-name=/}"
            if [ -n "$argValue" ]; then
                PROJECT_NAME="$argValue"
                isParamValid=true
            fi
        fi

        ##### Use unique tags for games
        if [[ "$arg" =~ ^--unique-tags$ ]] || [[ "$arg" =~ ^-ut$ ]]; then
            UNIQUE_TAGS_MODE=true
            isParamValid=true
        fi

        ##### Add the live game ids when running with the operation=add
        if [[ "$arg" =~ ^--add-live ]]; then
            ADD_LIVE=true
            isParamValid=true
        fi

        if [[ "$arg" =~ ^--add-nxt-support ]]; then
            ADD_NGM_NXT=true
            isParamValid=true
        fi

        if [[ "$isParamValid" == "false" ]] && [[ ! $arg == "" ]]; then
            logMessage "ERROR" "Script execution stopped: Invalid flag name or flag usage: '$arg'" "true"
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
    if [[ -z $TARGET_NAME ]]; then
        logMessage "ERROR" "Script execution stopped: missing value for --target-name flag." "true"
        exit 10
    fi
    if [[ -z $PROJECT_PATH ]]; then
        logMessage "ERROR" "Script execution stopped: missing value for --project-path flag." "true"
        exit 10
    fi
    if [[ -z $PROJECT_NAME ]]; then
        logMessage "ERROR" "Script execution stopped: missing value for --project-name flag." "true"
        exit 10
    fi

    OPERATION=$( [ -z "$OPERATION" ] && echo "$DEFAULT_OPERATION" || echo "$OPERATION")
    ASSETS_SOURCE_PATH=$(echo "$ASSETS_SOURCE_PATH" | sed "s/\/$//" ) # remove unwanted trailing /
    ODR_FOLDER_PATH="$PROJECT_PATH/$PROJECT_NAME/Resources/$ODR_FOLDER_NAME"
    CONFIG_PATH="$ASSETS_SOURCE_PATH/Apps/$TARGET_NAME"
    PROVIDER=$( [ -z "$PROVIDER" ] && echo "ALL" || echo "$PROVIDER")
    PROVIDERS_FOR_PARSE_CSV=$( [ -z "$PROVIDERS_FOR_PARSE_CSV" ] && echo "" || echo "$PROVIDERS_FOR_PARSE_CSV")
    GAMES=$( [ -z "$GAMES" ] && echo "" || echo "$GAMES")
    XCODEPROJ_FILE_PATH="$PROJECT_PATH/$PROJECT_NAME.xcodeproj"
    PBXPROJ_FILE_PATH="$XCODEPROJ_FILE_PATH/project.pbxproj"
    ADD_LIVE=$( [ -z "$ADD_LIVE" ] && echo false || echo "$ADD_LIVE")
    ADD_NGM_NXT=$( [ -z "$ADD_NGM_NXT" ] && echo false || echo "$ADD_NGM_NXT")
    UNIQUE_TAGS_MODE=$( [ -z "$UNIQUE_TAGS_MODE" ] && echo false || echo "$UNIQUE_TAGS_MODE")
    CLEAN_UP=$( [ -z "$CLEAN_UP" ] && echo false || echo "$CLEAN_UP")
    ODR_SPLIT=$( [ -z "$ODR_SPLIT" ] && echo "false" || echo "$ODR_SPLIT")

    if [ -z "$PROVIDERS" ]; then
        if [[ " ${ALL_PROVIDERS[*]} " =~ " $DEFAULT_PROVIDER " ]]; then
            PROVIDERS=("$argValue")
        elif [[ $DEFAULT_PROVIDER == "ALL" ]]; then
            PROVIDERS=( ${ALL_PROVIDERS[@]} )
        fi
    fi
}

function __printParamValues__() {
    logMessage "INFO" "Running script: $FILE_NAME with the following parameters:"
    logMessage "INFO" "Value for \$BASEDIR: $BASEDIR"
    logMessage "INFO" "Value for \$TARGET_NAME: $TARGET_NAME"
    logMessage "INFO" "Value for \$PROJECT_NAME: $PROJECT_NAME"
    logMessage "INFO" "Value for \$PROJECT_PATH: $PROJECT_PATH"
    logMessage "INFO" "Value for \$PBXPROJ_FILE_PATH: $PBXPROJ_FILE_PATH"
    logMessage "INFO" "Value for \$ASSETS_SOURCE_PATH: $ASSETS_SOURCE_PATH"
    logMessage "INFO" "Value for \$ODR_FOLDER_PATH: $ODR_FOLDER_PATH"
    logMessage "INFO" "Value for \$PROVIDERS: $( IFS=$' '; echo "${PROVIDERS[@]}" )"
    logMessage "INFO" "Value for \$GAMES: $( IFS=$' '; echo "${GAMES[@]}" )"
    logMessage "INFO" "Value for \$ADD_LIVE: $ADD_LIVE"
    logMessage "INFO" "Value for \$ODR_SPLIT: $ODR_SPLIT"
    logMessage "INFO" "Value for \$ADD_NGM_NXT: $ADD_NGM_NXT"
    logMessage "INFO" "Value for \$UNIQUE_TAGS_MODE: $UNIQUE_TAGS_MODE"
    logMessage "INFO" "----------"
}

##### Generate assetsToCopy.json and gamesList.json
## the configs are generated based on --providers and --games (and append to the already installed games)
function generateCustomConfigFiles() {
    local -a generateConfigsArguments

    generateConfigsArguments=("--source=$ASSETS_SOURCE_PATH" "--skip-check")
    generateConfigsArguments+=("--destination=$ODR_FOLDER_PATH")

    if [[ -n $PROVIDERS_FOR_PARSE_CSV ]]; then
        generateConfigsArguments+=("--providers=$PROVIDERS_FOR_PARSE_CSV")
    fi

    if [[ -n $GAMES ]]; then
        generateConfigsArguments+=("--games=$GAMES")
    fi

    if [[ $FORCE == "true" ]]; then
        generateConfigsArguments+=("--force")
    fi

    if [[ $VERBOSE == "true" ]]; then
        generateConfigsArguments+=("--verbose")
    fi

    if [[ $ADD_LIVE == "false" ]]; then
        generateConfigsArguments+=("--skip-live")
    fi

    if [[ $ODR_SPLIT == "true" ]]; then
      generateConfigsArguments+=("--odr-split")
    fi

    logMessage "INFO" "Generate configs with the following arguments: $( IFS=$' '; echo "${generateConfigsArguments[@]}" )"
    if ! "$BASEDIR"/generateConfigs.sh "${generateConfigsArguments[@]}"; then
      logMessage "ERROR" "Script stopped because it couldn't generate configs."
      exit 1
    fi
}

function addStagingPackages() {
    if [[ $(jq '.Playtech.common ' < "$TEMP_FOLDER/assetsToCopy.json") != "null" ]]; then
        case $TARGET_NAME in
          "tbd_native" | BF*)
              jq '.Playtech.common["betfaircasinostg.com.zip"] |= "odr" |
                  .Playtech.common["ptstaging1.03.zip"] |= "odr" |
                  .Playtech.common["betfaircasinostg.es.zip"] |= "odr" |
                  .Playtech.common["betfaircasinostg.dk.zip"] |= "odr" |
                  .Playtech.common["betfaircasinostg.ro.zip"] |= "odr" |
                  .Playtech.common["betfaircasinostg.se.zip"] |= "odr" ' \
                "$TEMP_FOLDER/assetsToCopy.json" > "$TEMP_FOLDER/assetsToCopy-temp.json"
              ;;

          PP*)
            jq '.Playtech.common["paddypowercasinostg.zip"] |= "odr" ' \
              "$TEMP_FOLDER/assetsToCopy.json" > "$TEMP_FOLDER/assetsToCopy-temp.json"
            ;;
        esac
   fi

    if [ -s "$TEMP_FOLDER/assetsToCopy-temp.json" ] ; then
        mv -f "$TEMP_FOLDER/assetsToCopy-temp.json" "$TEMP_FOLDER/assetsToCopy.json"
        logMessage "INFO" "Added staging packages for Playtech."
    fi
}

function initScript() {
    ##### Parse script arguments #####
    parseArguments "$@"

    ##### Initialize missing required variables with default values #####
    validateParamsValues

    if [[ $VERBOSE == "true" ]]; then
        __printParamValues__
    fi

    ##### Check if the dependencies are installed and configured ok
    if [[ $SKIP_CHECK != "true" ]]; then
        if ! "$BASEDIR"/checkDependencies.sh "$ASSETS_SOURCE_PATH"; then
          exit 1
        fi

        if ! [[ -d "$TEMP_FOLDER" ]]; then
            mkdir "$TEMP_FOLDER"
        fi
    fi

    if [[ $CLEAN_UP == "true" ]]; then
        cleanUpProject
        if [[ $FORCE == "true" ]]; then
            exit
        fi
    fi

    if [ "$OPERATION" == "add" ]; then
        ## Generate assetsToCopy.json and gamesList.json
        if ! generateCustomConfigFiles; then
            logMessage "ERROR" "Failed to generate custom app configs."
            exit 1
        fi
    else
        ##### Copy the file with the list of assets to be copied from the server
        logMessage "INFO" "Copy configs from $CONFIG_PATH"
        mc cp "$CONFIG_PATH/assetsToCopy.json" "$TEMP_FOLDER/assetsToCopy.json"
        mc cp "$CONFIG_PATH/gamesList.json" "$TEMP_FOLDER/gamesList.json"
    fi

    if [ ! -s "$TEMP_FOLDER/assetsToCopy.json" ] ; then
        logMessage "ERROR" "Missing assetsToCopy.json file"
        exit
    fi
    if [ ! -s "$TEMP_FOLDER/gamesList.json" ] ; then
        logMessage "ERROR" "Missing gamesList.json file"
        exit
    fi

    if [[ $ADD_NGM_NXT == "true" ]]; then
        addStagingPackages
    fi

    if [[ $UNIQUE_TAGS_MODE == "true" ]]; then
        generateAndAddVersioningToGamesListJSON
    fi

    mc cp  "$TEMP_FOLDER/gamesList.json" "$ODR_FOLDER_PATH/gamesList.json"
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

function cleanUp() {
    logMessage "INFO" "Clean up temp files"
    rm -f "$PBXPROJ_FILE_PATH\"\""
    rm -f $(find "$XCODEPROJ_FILE_PATH" -type f | grep "\.\![[:digit:]]\{1,\}\!project.pbxproj$")
#   rm -rf "$TEMP_FOLDER"
}

function listFolder() {
    mc ls --json "$1" | tr "\n" " " | sed "s/} {/},{/g" | sed "s/^{/[{/" | sed "s/} $/}]/" | jq '.[].key' | tr -d '"' | tr -d "/"
}

# Copy a file for $1=source to $2=destination using the mc CLI
# $1 - the source of the file to copy
# $2 - the destination path prefix for the file to copy
function copyFile() {
    local shouldRetry=true
    local retryNumber=1
    logMessage "INFO" "Copy resource $fileSourcePath to $fileDestinationPath"

    while [ $shouldRetry = true ] && [ $retryNumber -le $DEFAULT_NUMBER_OF_RETRIES ] ; do
        # Check if the retrieved data is valid
        if  [ $retryNumber -gt 1 ] ; then
            logMessage "WARN" "Copy resource $fileSourcePath to $fileDestinationPath - Retry $retryNumber"
        fi
        output=$(mc cp "$1" "$2" 2>&1)
        if [[ $? -ne 0 ]]; then
            retryNumber=$(( retryNumber + 1 ))
        else
            if [[ $output == *"Unable to prepare URL for copying. Unable to guess the type of copy operation."* ]]; then
                ## unfortunately mc might return 0 also when it cannot initiate the copy (File not found)
                retryNumber=$(( retryNumber + 1 ))
            else
                shouldRetry=false
            fi
        fi

        if [ $shouldRetry = true ] && [ $retryNumber -gt $DEFAULT_NUMBER_OF_RETRIES ] ; then
            logMessage "ERROR" "$1 file couldn't be copied - maximum number of reties reached!" true
            exit 1
        fi
    done
}

########################################################################################################################
function initOnDemandResourcesFolders {
    if ! doesODRFolderExist; then
        logMessage "INFO" "$ODR_FOLDER_NAME folder does not exist in project"
        # Create all the folder
        createOnDemandResourcesFolders

        #Add OnDemandResource folders to the project file
        addFoldersToProject

        # Save the id of the Resources Folder inside the Build Phase target for later use
        BUILD_PHASE_RESOURCE_FOLDER_ID=$(getBuildPhaseResourceFolderId)

        # Add the gamesList.json file to the project.pbxproj file
        addFileToXCode "$ODR_FOLDER_PATH/gamesList.json" "gamesList.json" "false" "$ODR_FOLDER_NAME"
    else
        # ODR folder already exists in project"
        # Save the id of the Resources Folder inside the Build Phase target for later use
        BUILD_PHASE_RESOURCE_FOLDER_ID=$(getBuildPhaseResourceFolderId)
    fi
}

function createOnDemandResourcesFolders() {

    if ! [[ -d "$ODR_FOLDER_PATH" ]]; then
        mkdir "$ODR_FOLDER_PATH"
        touch "$ODR_FOLDER_PATH/gamesList.json"
    fi

    for provider in "${ALL_PROVIDERS[@]}"; do
        mkdir "$ODR_FOLDER_PATH/$provider"
        logMessage "INFO" "Create $ODR_FOLDER_PATH/$provider folder"
    done
}

function getBuildPhaseResourceFolderId() {
    local targetsLine=$(grep -Fn 'targets = (' "$PBXPROJ_FILE_PATH" | awk -F':' '{print $1}')
    local targetId=$(tail -n +"$targetsLine" "$PBXPROJ_FILE_PATH" | grep -Fn "/* $TARGET_NAME */," | head -1 | awk -F' ' '{print $2}')
    local targetGroupLine=$(grep -Fn "$targetId /* $TARGET_NAME */ = {" "$PBXPROJ_FILE_PATH" | awk -F':' '{print $1}')
    local resourcesFolderTargetId=$(tail -n +"$targetGroupLine" "$PBXPROJ_FILE_PATH" | grep -Fn '/* Resources */,' | head -1 | awk -F' ' '{print $2}')
    echo "$resourcesFolderTargetId"
}

# Check if the required ODR folders exist
# Returns
#     - 0 if the folders are all OK
#     - 1 if some or all folders are missing
function doesODRFolderExist() {
    local odrFolderHash=$(echo "$ODR_FOLDER_NAME" | md5)
    local existingProjectODRHash=$(grep -Fn "$odrFolderHash" "$PBXPROJ_FILE_PATH")
    local existingProjectFolder=$(grep -Fn "$ODR_FOLDER_NAME" "$PBXPROJ_FILE_PATH")

    if [[ -z "$existingProjectODRHash" ]] || [[ -z "$existingProjectFolder" ]]; then
        return 1
    else
        return 0
    fi
}

# script that adds the game assets to the selected Xcode project and sets the ODR tags
function addFoldersToProject() {
    local odrFolderHash=$(echo "$ODR_FOLDER_NAME" | md5)

    local mainGroupId=$(grep -Fn 'mainGroup = ' "$PBXPROJ_FILE_PATH" | awk -F' ' '{print $4}' | tr -d ";")
    # Find Group Id
    local mainGroupLine=$(grep -Fn "$mainGroupId = {" "$PBXPROJ_FILE_PATH" | awk -F':' '{print $1}')
    local groupId=$(tail -n +"$mainGroupLine" "$PBXPROJ_FILE_PATH" | grep -Fn "/* $PROJECT_NAME */," | head -1 | awk -F' ' '{print $2}')

    # Find Resources Group Id
    local groupLine=$(grep -Fn "$groupId /* $PROJECT_NAME */ = {" "$PBXPROJ_FILE_PATH" | awk -F':' '{print $1}')
    local resourcesGroupId=$(tail -n +"$groupLine" "$PBXPROJ_FILE_PATH" | grep -Fn '/* Resources */,' | head -1 | awk -F' ' '{print $2}')
    local resourcesGroupLine=$(grep -Fn "$resourcesGroupId /* Resources */ = {" "$PBXPROJ_FILE_PATH" | awk -F':' '{print $1}')

    # Add GamesOnDemandResources folder under the correct Resources group
    $sed_command "$((resourcesGroupLine + 3))i\\
    $odrFolderHash /* $ODR_FOLDER_NAME */,
    " "$PBXPROJ_FILE_PATH"

    # Add GamesOnDemandResources group
    $sed_command "${resourcesGroupLine}i\\
    $odrFolderHash /* $ODR_FOLDER_NAME */ = {\\
        isa = PBXGroup;\\
        children = (\\
        );\\
        path = $ODR_FOLDER_NAME;\\
        sourceTree = \"<group>\";\\
    };
        " "$PBXPROJ_FILE_PATH"

    for provider in "${ALL_PROVIDERS[@]}"; do
        local providerHash=$(echo "$provider" | md5)

        # Add current provider to the GamesOnDemandResources group
        local odrGroupLine=$(grep -Fn "$odrFolderHash /* $ODR_FOLDER_NAME */ = {" "$PBXPROJ_FILE_PATH" | head -1 | awk -F':' '{print $1}')
        $sed_command "$((odrGroupLine + 3))i\\
        $providerHash /* $provider */,
        " "$PBXPROJ_FILE_PATH"

        # Add current provider group
        $sed_command "${resourcesGroupLine}i\\
        $providerHash /* $provider */ = {\\
            isa = PBXGroup;\\
            children = (\\
            );\\
            path = $provider;\\
            sourceTree = \"<group>\";\\
        };
        " "$PBXPROJ_FILE_PATH"
    done
}

########################################################################################################################
# Migrate games from assets function
function migrateProvidersAssets() {
    if [[ -z ${PROVIDERS[*]} ]]; then # if PROVIDERS list is empty
        logMessage "ERROR" "Provider list cannot be empty. Make sure you have files on $ASSETS_SOURCE_PATH" true
        exit 1
    fi

    local -a providers
    providers=$(jq -r 'keys[]' < "$TEMP_FOLDER/assetsToCopy.json") # Extract all the keys for assetsToCopy.json

    for provider in $providers; do
        logMessage "INFO" "#################### Configuring assets for $provider provider ####################"

        local commonSourcePath="$ASSETS_SOURCE_PATH/$provider/Common"
        local sourcePath="$ASSETS_SOURCE_PATH/$provider/Games"
        local destinationPath="$ODR_FOLDER_PATH/$provider" # ODR_FOLDER_PATH is the local Games On Demand Resources folder

        providerAssets=$(jq --arg keyProvider "$provider" '.[$keyProvider]' < "$TEMP_FOLDER/assetsToCopy.json")
        if [ "$providerAssets" != "null" ]; then
            # Migrate games assets for the current provider
            providerGamesCount=$(echo "$providerAssets" | jq '.games | keys | length')
            if [ "$providerGamesCount" -gt 0 ]; then # If at least one game for provider
                providerGames=$(echo "$providerAssets" | jq -r '.games | keys[] ') # Get all the zip assets for a provider
                for assetZipFile in $providerGames; do
                    assetType=$(echo "$providerAssets" | jq -r --arg keyFile "$assetZipFile" '.games | .[$keyFile] ')
                    migrateOneAsset "$sourcePath/$assetZipFile" "$destinationPath" "$assetZipFile" "$provider" "false" "$assetType"
                done
            else
                logMessage "WARN" "No games assets processed for $provider"
            fi

            # Migrate common assets for the current provider
            providerCommonCount=$(echo "$providerAssets" | jq '.common | keys | length')
            if [ "$providerCommonCount" -gt 0 ]; then
                providerCommon=$(echo "$providerAssets" | jq -r '.common | keys[] ')
                for assetZipFile in $providerCommon; do
                    assetType=$(echo "$providerAssets" | jq -r --arg keyFile "$assetZipFile" '.games | .[$keyFile] ')
                    migrateOneAsset "$commonSourcePath/$assetZipFile" "$destinationPath" "$assetZipFile" "$provider" "true" "$assetType"
                done
            else
                logMessage "WARN" "No common assets processed for $provider"
            fi
        else
            logMessage "WARN" "No assets processed for $provider"
        fi
    done
}

# Migrate one game function.
#   This function will try to do two things:
#   1. a) to copy the resource to ODR destination folder but only the operation is copy or add and the file is not already there
#      b) to create an empty file in the resource to ODR destination folder when the operation is touch
#       ***note - if the file is already copied/created it will skip the step
#   2. It will add the file into the project together with the tag (but only if the file wasn't already in the ODR
#       folder in order not to add the same file multiple times)
#
#
# $1 - the source of the file to copy
# $2 - the destination path prefix for the file to copy, typically the local Games On Demand Resources folder
# $3 - the file name
# $4 - provider name
# $5 - a flag that tells the script to append the provider to the destination file name and tag
# $6 - the type of the resource added to the project (odr, bundle, odrSplit)
function migrateOneAsset() {
    local fileSourcePath="$1"
    local fileName="$3"
    local provider="$4"
    local resourceType="$6"
    if [ "$resourceType" == "odrSplit" ]; then
        local gameId=${fileSourcePath/%.zip/}
        fileSourcePath="$gameId-split-odr.zip"
    fi
    local fileDestinationPath="$2/$fileName"
    local providerPrefix=""
    if [ "$5" == true ]; then # Add the provider prefix to the file name
        fileDestinationPath="$2/$provider.$fileName"
        providerPrefix="$provider."
    fi

    if [ -s "$fileDestinationPath" ]; then
        ###### The file exists and has a size greater than zero.
        logMessage "WARN" "Game $fileName already migrated"
    elif [ -f "$fileDestinationPath" ]; then
        ###### The file exists and is a regular file but the asset file is empty
        if [ "$OPERATION" == "copy" ] || [ "$OPERATION" == "add" ]; then
            # will copy the full file over it but will not add a tag as is should already exist
            if ! copyFile "$fileSourcePath" "$fileDestinationPath"; then
                exit 1
            fi
        else
            # Should do nothing as the file exist and has should have the tag added
            logMessage "WARN" "Resource $providerPrefix$fileName already migrated"
        fi
    else
        ##### The file does not exist
        if [ "$OPERATION" == "copy" ] || [ "$OPERATION" == "add" ]; then
            if ! copyFile "$fileSourcePath" "$fileDestinationPath"; then
                exit 1
            fi
        else
            # Check if the packages is required to be bundled, in this case copy the original package to the project without a tag
            if [ "$resourceType" == "bundle" ]; then
                if ! copyFile "$fileSourcePath" "$fileDestinationPath"; then
                    exit 1
                fi
            else
                logMessage "INFO" "Create empty asset file $fileDestinationPath"
                touch "$fileDestinationPath"
            fi
        fi

        if [ "$resourceType" == "bundle" ]; then
            # don't set ODR tag on fully embedded asset
            addFileToXCode "$fileDestinationPath" "$providerPrefix$fileName" "false" "$provider"
        else
            addFileToXCode "$fileDestinationPath" "$providerPrefix$fileName" "true" "$provider"
        fi
    fi
}

# Get the project's version and build number so they can be used to compose the versioning suffix for the games' tags
# Add these two values to the existent content of gamesList.json file, so they can be extracted inside GamesFramework
function generateAndAddVersioningToGamesListJSON() {
    appVersion=$(xcodebuild -configuration "Release" -showBuildSettings -project "$XCODEPROJ_FILE_PATH" | grep -i 'MARKETING_VERSION' | sed 's/[ ]*MARKETING_VERSION = //')
    buildNumber=$(xcodebuild -configuration "Release" -showBuildSettings -project "$XCODEPROJ_FILE_PATH" | grep -i 'CURRENT_PROJECT_VERSION' | sed 's/[ ]*CURRENT_PROJECT_VERSION = //')

    if [[ -n "$appVersion" ]] && [[ -n "$buildNumber" ]]; then

        TAGS_SUFFIX="$appVersion-$buildNumber"
        logMessage "INFO" "Will use the \"-$TAGS_SUFFIX\" suffix to uniquely tag resources of the games"

        jq ".appVersion |= \"$appVersion\" |
        .buildNumber |= \"$buildNumber\" " \
        "$TEMP_FOLDER/gamesList.json" > "$TEMP_FOLDER/gamesList-temp.json"

        if [ -s "$TEMP_FOLDER/gamesList-temp.json" ]; then
            mv -f "$TEMP_FOLDER/gamesList-temp.json" "$TEMP_FOLDER/gamesList.json"
            logMessage "INFO" "Added <appVersion: $appVersion> and <buildNumber: $buildNumber> to gamesList.json"
        fi
    else
        logMessage "ERROR" "Could not find project's version and build number. Will not have the games' tag versioned" true
    fi
}

function cleanUpProject() {
    local odrGroupId

    logMessage "INFO" "Remove existing references of $ODR_FOLDER_NAME group from Xcode project"

    odrGroupId=$("$plistBuddy" -c "Print :objects" "$PBXPROJ_FILE_PATH" | grep -E -B 1 "path = $ODR_FOLDER_NAME$" | head -n 1 | awk -F " = " '/^ / {print $1}' | tr -d "[:space:]")
    deleteItemsFromXcode "$odrGroupId"

    rm -rf "$ODR_FOLDER_PATH"
}

# Function that removes all the references of an item from the selected XCode project.
# $1 - the id of the item that need to be removed
function deleteItemsFromXcode() {
    local itemId
    local itemType
    local itemPath
    local itemChildren

    # save the item id received as param to the local itemId variable
    itemId="$1"

    # fetch the itemId isa type
    itemType=$("$plistBuddy" -c "Print :objects:$itemId:isa" "$PBXPROJ_FILE_PATH" 2>/dev/null)
    itemPath=$("$plistBuddy" -c "Print :objects:$itemId:path" "$PBXPROJ_FILE_PATH" 2>/dev/null)

    if [ "$itemType" == "PBXFileReference" ]; then
        # Remove all references for the item form Xcode project
        PBXFileReferenceId=$(grep "$itemId" "$PBXPROJ_FILE_PATH" | grep "isa = PBXBuildFile; fileRef = $itemId" | awk -F' ' '{print $1}')
        $sed_command "/$PBXFileReferenceId/d" "$PBXPROJ_FILE_PATH"
        $sed_command "/$itemId/d" "$PBXPROJ_FILE_PATH"
    elif [ "$itemType" == "PBXGroup" ]; then
        # Get the list of children for the specified parent item
        itemChildren=$("$plistBuddy" -c "Print :objects:$itemId:children" "$PBXPROJ_FILE_PATH" 2>/dev/null | grep -o '[0-9a-f]\{32\}')

        # Check if the group has children
        if [ -n "$itemChildren" ]; then
            # Iterate through the children and recursively delete them
            logMessage "INFO" "  - Removing the $itemPath group children"
            while IFS= read -r line ; do
                deleteItemsFromXcode "$line"
            done <<< "$itemChildren"
        fi

        logMessage "INFO" "  - Removing the $itemPath group references"
        # Remove the group reference from it's parent
        $sed_command "/$itemId \/\* $itemPath \*\/,/d" "$PBXPROJ_FILE_PATH"
        # Remove the empty group reference
        $sed_command "/$itemId/,/};/d" "$PBXPROJ_FILE_PATH"
    fi
}

# Function that adds the game assets to the selected XCode project and sets the ODR tags
# $1 - the path to the file
# $2 - the file name
# $3 - a flag that tells the script if it should add tag or not also a tag for the file (true/false values)
# $4 - the group name where to add the file
function addFileToXCode() {
    logMessage "INFO" "add $1 file to the project.pbxproj file"
    if [ -f "$1" ]; then
        local fileRefChecksum=$(find "$1" -type f -exec md5 {} \; | sort -k 2 | md5 | awk '{print $1}')
        local gameId=${2/%.zip/}
        local gameAssetFileName=$2
        local gameIdChecksum=$(echo "$1" | md5 | awk '{print $1}')
        local groupName=$4
        logMessage "INFO" "Will update project.pbxproj file for gameId=$gameId with gameIdChecksum=$gameIdChecksum to fileRefChecksum=$fileRefChecksum"
        if [ "$3" == true ]; then
            if [[ -n "$TAGS_SUFFIX" ]] && [[ $UNIQUE_TAGS_MODE == "true" ]]; then
                local tagsAttribute="settings = {ASSET_TAGS = ($gameId-$TAGS_SUFFIX, ); }; "
            else
                local tagsAttribute="settings = {ASSET_TAGS = ($gameId, ); }; "
            fi
            local lastKnownFileType="archive.zip"
            local fileEncodingAttribute=""
        else
            local tagsAttribute=""
            local lastKnownFileType="text.json"
            local fileEncodingAttribute="fileEncoding=4; "
        fi

        # Add tags for each resource file before the line containing `/* End PBXBuildFile section */`
        $sed_command 's/\/\* End PBXBuildFile section \*\//        '"$gameIdChecksum"' \/\* '"$gameAssetFileName"' in Resources \*\/ = {isa = PBXBuildFile; fileRef = '"$fileRefChecksum"' \/\* '"$gameAssetFileName"' \*\/; '"$tagsAttribute"' };\
\/\* End PBXBuildFile section \*\//' "$PBXPROJ_FILE_PATH"

        # Add each resource file before the line containing `/* End PBXFileReference section */`
        local PBXFileReference=$(grep -Fn "/* End PBXFileReference section */" "$PBXPROJ_FILE_PATH" | awk -F':' '{print $1}')
        $sed_command "$((PBXFileReference - 1))i\\
        $fileRefChecksum /* $gameAssetFileName */ = {isa = PBXFileReference; lastKnownFileType = $lastKnownFileType; $fileEncodingAttribute path = '$gameAssetFileName'; sourceTree = \"<group>\"; };
        " "$PBXPROJ_FILE_PATH"

        # Add each resource file inside the correct provider folder under children
        local assetGroupChildrenLine=$(grep -Fn "/* $groupName */ = {" "$PBXPROJ_FILE_PATH" | head -1 | awk -F':' '{print $1}')
        $sed_command "$((assetGroupChildrenLine + 3))i\\
        $fileRefChecksum /* $gameAssetFileName */,
        " "$PBXPROJ_FILE_PATH"

        # Add each resource file inside Resources group from PBXResourcesBuildPhase (on the correct target)
        local BuildPhaseLine=$(grep -Fn "$BUILD_PHASE_RESOURCE_FOLDER_ID /* Resources */ = {" "$PBXPROJ_FILE_PATH" | head -1 | awk -F':' '{print $1}')
        $sed_command "$((BuildPhaseLine + 4))i\\
        $gameIdChecksum /* $gameAssetFileName in Resources */,
        " "$PBXPROJ_FILE_PATH"
    else
        logMessage "WARN" "The $1 file does not exist!"
    fi
}

########################################################################################################################
# Script starts from here
initScript "$@"

initOnDemandResourcesFolders

# Migrate the assets to the ODR folder
migrateProvidersAssets

cleanUp
