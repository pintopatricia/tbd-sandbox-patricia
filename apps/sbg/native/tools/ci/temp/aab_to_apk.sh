#!/bin/bash

set -e

#4. Create keystore
echo $RELEASE_KEYSTORE | base64 --decode > release.keystore

#5. Create APKS File
bundletool build-apks --bundle=${AAB_FILE_NAME} --output=${APKS_FILE_NAME} --mode=universal --ks=release.keystore --ks-key-alias=skybet --ks-pass=pass:"${ANDROID_UPLOAD_STORE_PW}"
