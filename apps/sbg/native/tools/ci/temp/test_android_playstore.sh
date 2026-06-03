#!/bin/bash

set -e

mkdir -p tmp

export APP_NAME=android_sbg_release-${RELEASE_BUILD_NUMBER}
export AAB_FILE_NAME=${APP_NAME}.aab

export NODE_TLS_REJECT_UNAUTHORIZED=0

# 1. Install Bundle Tool - used docker

#2. Download AAB
curl -o tmp/${AAB_FILE_NAME} https://artifactory-prd.prd.betfair/artifactory/tbd-native/android/sbg/release/${AAB_FILE_NAME}

#3. Set envs
export APKS_FILE_NAME=${APP_NAME}.apks
export APK_FILE_NAME=${APP_NAME}.apk

#5. Create APKS File
docker run -i --rm \
    --platform linux/amd64 \
    -v ${PWD}/tmp/:/usr/app/ \
    -v ${PWD}/apps/sbg/native/tools/ci/temp/aab_to_apk.sh:/tmp/script.sh \
    -e ANDROID_UPLOAD_STORE_PW=${ANDROID_UPLOAD_STORE_PW} \
    -e RELEASE_KEYSTORE=${RELEASE_KEYSTORE} \
    -e APKS_FILE_NAME=${APKS_FILE_NAME} \
    -e AAB_FILE_NAME=${AAB_FILE_NAME} \
    docker.app.betfair/ppb/tbdn/tools/bundletool-release:latest /tmp/script.sh


#6. Extract APK
unzip -p tmp/${APKS_FILE_NAME} universal.apk > ${APK_FILE_NAME}
