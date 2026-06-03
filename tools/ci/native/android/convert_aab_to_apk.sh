#!/bin/bash

set -e

# Create keystore
echo $RELEASE_KEYSTORE | base64 --decode > release.keystore

# Create APKS File
bundletool build-apks --bundle=${AAB_FILE_NAME} --output=${APKS_FILE_NAME} --mode=universal --ks=release.keystore --ks-key-alias=${ANDROID_KEYSTORE_ALIAS} --ks-pass=pass:"${ANDROID_UPLOAD_STORE_PW}"
