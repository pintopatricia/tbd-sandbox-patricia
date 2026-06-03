#!/bin/bash

BASEDIR=$(dirname "$0")
TEMP_FOLDER="$BASEDIR/../temp"
source=$(echo "$1" | sed "s/\/$//")
destination=$(echo "$2" | sed "s/\/$//")

providersList=$(jq -r 'keys[]' "$TEMP_FOLDER/assetsToCopy.json")
providers=()
while IFS= read -r line; do
    if [ -n "$line" ]; then
        providers+=("$line")
    fi
done <<< "$providersList"

if [ ${#providers[@]} -eq 0 ]; then
    echo "No assets to process"
else
    for provider in "${providers[@]}"; do
        cdnGamesList=$(jq -r --arg keyProvider "$provider" '.[$keyProvider].games | to_entries | map(select(.value == "odrSplit")) | .[].key' "$TEMP_FOLDER/assetsToCopy.json" | sed "s/.zip$//")
        cdnGames=()
        while IFS= read -r line; do
            if [ -n "$line" ]; then
              cdnGames+=("$line")
            fi
        done <<< "$cdnGamesList"

        if [ ${#cdnGames[@]} -eq 0 ]; then
            echo "No assets to process for $provider"
        else
            echo "Processing resources for $provider"
            for cdnGame in "${cdnGames[@]}"; do
                echo " - copy $cdnGame-split-cdn.zip"
                mc cp "$source/$provider/Games/$cdnGame-split-cdn.zip" "$destination/"
            done
        fi
    done
fi

