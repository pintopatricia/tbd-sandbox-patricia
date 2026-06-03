#!/bin/bash

set -e

echo "Running local set up script..."

brand=${BRAND:-bf}
export NATIVE_PROJECT_DIR="$PWD/../../../apps/$brand/native"
echo "NATIVE_PROJECT_DIR set to: $NATIVE_PROJECT_DIR"

echo "Kill appium process if exists"
pkill -f appium || true

if [ "$brand" == "bf" ]; then
  export NATIVE_WORKSPACE="@ppb/tbd-native"
else
  export NATIVE_WORKSPACE="@ppb/tbdsbg-native"
fi

echo "NATIVE_WORKSPACE set to: $NATIVE_WORKSPACE"

echo "Running appium driver management script..."
sh $PWD/config/scripts/appium-manage-drivers.sh

platform=${PLATFORM:-android}
if [ "$platform" == "android" ]; then
  sh $PWD/config/scripts/settings/prompt_android.sh
fi
