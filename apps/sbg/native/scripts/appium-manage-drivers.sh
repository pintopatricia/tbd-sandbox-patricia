#!/bin/bash

set -e

export APPIUM_HOME=../../../node_modules/appium/
export APPIUM_PATH=../../../node_modules/.bin/appium
output=$($APPIUM_PATH driver list 2>&1)

if ! echo "$output" | grep ".*uiautomator2.*installed (npm).*"; then
    echo "NOT INSTALLED! Installing uiautomator2..."
    $($APPIUM_PATH driver install uiautomator2@2.29.10)
else
    echo "uiautomator2 is already installed, skipping...."
fi

if ! echo "$output" | grep ".*xcuitest.*installed (npm).*"; then
    echo "NOT INSTALLED! Installing xcuitest..."
    $($APPIUM_PATH driver install xcuitest@5.4.1)
else
    echo "xcuitest is already installed, skipping...."
fi
