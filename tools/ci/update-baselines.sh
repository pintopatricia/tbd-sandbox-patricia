#!/bin/bash

set -e

BRANCH_NAME=$GIT_BRANCH
BASE_FOLDER=$1
BASELINES_FOLDER=$2

echo "Current branch: $BRANCH_NAME"

if [ "$BRANCH_NAME" != "master" ]; then
    echo "Adding baselines ..."
    # Define source, destination, and reference folders
    SOURCE="$BASE_FOLDER/actual/desktop_chrome"
    DESTINATION="$BASE_FOLDER/$BASELINES_FOLDER"
    REFERENCE="$BASE_FOLDER/diff/desktop_chrome"
    echo "Baselines to update from: $DESTINATION"

    BASELINES_BRANCH="$BRANCH_NAME-baselines"
    
    if git ls-remote --exit-code --heads origin $BASELINES_BRANCH; then
        echo "Branch '$BASELINES_BRANCH' already exists on remote. Checking out ..."
        git fetch --no-tags origin refs/heads/$BASELINES_BRANCH:$BASELINES_BRANCH
        git checkout $BASELINES_BRANCH
    else
        echo "Creating new branch '$BASELINES_BRANCH'."
        git checkout -b $BASELINES_BRANCH
    fi

    # Copy new baselines to the baselines folder
    rsync -av --ignore-existing $SOURCE $DESTINATION/
    # Update different baselines
    # Loop through files in the actual folder
    for FILE in "$SOURCE"/*; do
        FILENAME=$(basename "$FILE")
        
        # Check if file exists in the diff folder
        if [ -f "$REFERENCE/$FILENAME" ]; then
            # Copy file to the baselines folder
            cp "$FILE" "$DESTINATION/desktop_chrome"
        fi
    done
    git add $DESTINATION
    git restore .
    git commit -m "test: update baselines for $BRANCH_NAME #NA"
    git push -u origin $BASELINES_BRANCH

    docker run -i --rm -v ${PWD}/tools/ci/create-baselines-pr.sh:/tmp/script.sh -e GITHUB_TOKEN=${GITHUB_TOKEN} -e BRANCH_NAME=${BRANCH_NAME} -e BASELINES_BRANCH=${BASELINES_BRANCH} -e BASE_PR=${ghprbPullId} docker.app.betfair/ppb/github-gh-cli sh /tmp/script.sh
else
  echo "Parameter is equal to master. No commit commands executed."
fi