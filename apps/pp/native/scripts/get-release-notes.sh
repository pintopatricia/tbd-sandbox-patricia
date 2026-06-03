#!/bin/sh

if [ -z "${GIT_BRANCH}" ]; then
    currentBranch=`git rev-parse --abbrev-ref HEAD`
else
    currentBranch=${GIT_BRANCH}
fi

lastCommitMessage=`git log -1 --author='^(?!Jenkins).*$' --perl-regexp --format="commit message: %s \ncommit hash: %h\ncommitter name: %cn\n"`
gitMessage="${lastCommitMessage}branch: ${currentBranch}"

if [ -z "$BUILD_URL" ]; then
    echo -e ${gitMessage} > release_notes.txt
else
    jenkinsBuildUrl="Jenkins Build URL: ${BUILD_URL}"
    jenkinsBuildTag="Jenkins Build TAG: ${BUILD_TAG}"
    echo -e "${gitMessage}\n${jenkinsBuildUrl}\n${jenkinsBuildTag}" > release_notes.txt
fi