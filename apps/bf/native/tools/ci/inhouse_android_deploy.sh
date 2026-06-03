#!/bin/bash

set -e

sed -i "s/FACEBOOK_APP_ID/$FB_APP_ID/g" apps/bf/native/android/app/src/main/res/values/configs.xml
sed -i "s/FACEBOOK_APP_TOKEN/$FB_APP_TOKEN/g" apps/bf/native/android/app/src/main/res/values/configs.xml
cd apps/bf/native
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
docker build --build-arg FIREBASE_CI_KEY=${FIREBASE_CI_KEY} --build-arg BUILD_NUMBER=${ANDROID_BUILD_NUMBER} -t ppb/tbdn/deploy-inhouse -f ./Docker/targets/inhouse/deploy.inhouse.android.Dockerfile .
