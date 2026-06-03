BASEDIR=$(dirname "$0")
FILE_NAME=$(basename "$0")
TEMP_FOLDER="$BASEDIR/../temp"
DEFAULT_LOG_FILE="$TEMP_FOLDER/copyGames.log"

# Logging function
function logMessage() {
    if [[ $VERBOSE == "true" ]] || [[ $3 == "true" ]]; then
        printf "[%s] \t $FILE_NAME \t %s\n" "$(date "+%H:%M:%S")" "$1 $2"
    else
        printf "[%s] \t $FILE_NAME \t %s\n" "$(date "+%H:%M:%S")" "$1 $2" >> "$DEFAULT_LOG_FILE"
    fi
}

logMessage "INFO" "Checking for MinIO CLI on your system ...."
if ! mc -v > /dev/null; then
    logMessage "INFO" "Install MinIO CLI"
    brew install minio/stable/mc
else
    logMessage "INFO" "MinIO CLI already installed"
fi

# Testing for MinIO access"
if [ -n "$1" ]; then # expected to be asset source path
    if ! mc ls "$1" | grep -q "0B"; then
        logMessage "ERROR" "Script execution stopped: Invalid Assets source path. Check https://flutteruki.atlassian.net/wiki/x/9MbFB for more details on how to configure the access the aws games-assets bucket" "true"
        printf "\n\n"
        exit 1
    fi
    logMessage "INFO" "MinIO access OK"
fi

# Testing if jq JSON processor is installed"
if ! jq -help >/dev/null; then
    logMessage "INFO" "Install jq - commandline JSON processor"
    brew install jq
else
    logMessage "INFO" "jq - commandline JSON processor already installed"
fi
