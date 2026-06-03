#!/bin/bash

set -e

BRANCH_NAME=$GIT_BRANCH
BASELINES_BRANCH=${baselines_branch}
BASE_FOLDER=$PWD/$1
BASELINES_FOLDER=$2
BASE_PWD=$PWD

echo "Current branch: $BRANCH_NAME"

if [ "$BASELINES_BRANCH" == "master" ] || [ -z "$BASELINES_BRANCH" ]; then
    echo "On master branch. Creating a new branch for baselines..."
    BASELINES_BRANCH="$BRANCH_NAME-baselines"
else
    echo "On branch: $BASELINES_BRANCH"
fi
    echo "Adding baselines ..."
    # Define source, destination, and reference folders
    SOURCE="$BASE_FOLDER/actual"
    DESTINATION="${BASE_FOLDER}/baselines/bf/ios/tbd-native-visual-tests-baseline/baselines"
    REFERENCE="$BASE_FOLDER/diff"
    echo "Baselines to update from: $DESTINATION"

    BASELINES_BRANCH="$BRANCH_NAME-baselines"
    cd ${DESTINATION}

    if git ls-remote --exit-code --heads origin "$BASELINES_BRANCH" >/dev/null; then
      echo "Branch '$BASELINES_BRANCH' already exists on remote. Checking out ..."
      git fetch --no-tags origin refs/heads/$BASELINES_BRANCH:$BASELINES_BRANCH
      git checkout "$BASELINES_BRANCH"

    elif git rev-parse --verify "$BASELINES_BRANCH" >/dev/null 2>&1; then
      echo "Branch '$BASELINES_BRANCH' already exists locally. Checking out ..."
      git checkout "$BASELINES_BRANCH"

    else
      echo "Creating new branch '$BASELINES_BRANCH'."
      git checkout -b "$BASELINES_BRANCH"
    fi


    # Copy new baselines to the baselines folder
    cd ${BASE_FOLDER}
    echo "Source ${SOURCE}"
    echo "Source2 ${DESTINATION}"
    rsync -av --ignore-existing $SOURCE/ $DESTINATION

    # Update different baselines
    # Loop through files in the actual folder
    for FILE in "$SOURCE"/*; do
        FILENAME=$(basename "$FILE")

        # Check if file exists in the diff folder
        if [ -f "$REFERENCE/$FILENAME" ]; then
            # Copy file to the baselines folder
            cp "$FILE" "$DESTINATION"
        fi
    done
    echo "Destination "$DESTINATION""
    cd ${DESTINATION}
    git add $DESTINATION
    echo "Destination "currentDir="$(dirname "$0")"""
    git restore .
    git commit -m "test: update baselines for $BRANCH_NAME #NA"
    git push -u origin $BASELINES_BRANCH
    echo "PWD "$BASE_PWD""
    cd ${BASE_PWD}
    docker run -i --rm -v ${PWD}/tools/ci/create-baselines-pr.sh:/tmp/script.sh -e GITHUB_TOKEN=${GITHUB_TOKEN} -e BRANCH_NAME=${BRANCH_NAME} -e BASELINES_BRANCH=${BASELINES_BRANCH} -e BASE_PR=${ghprbPullId}  -e TARGET_REPO="Flutter-Global/tbd-native-visual-tests-baseline" -e TARGET_BRANCH="master" docker.app.betfair/ppb/github-gh-cli sh /tmp/script.sh
