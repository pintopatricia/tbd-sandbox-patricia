#!/bin/bash
set -x
NAME=$1

if [[ $NAME == *"tbdsbg-mobile-site"* ]]; then
  FOLDER="sbg/web"
  SPEC_FILE_PATH="apps/sbg"
elif [[ $NAME == *"tbdsbg-native"* ]]; then
  FOLDER="sbg/native"
  SPEC_FILE_PATH="apps/sbg"
elif [[ $NAME == *"tbd-native"* ]] || [[ $NAME == *"tbdexc-native"* ]]; then
  FOLDER="bf/native"
  SPEC_FILE_PATH="apps/bf"
elif [[ $NAME == *"tbdps-mobile-site"* ]]; then
  FOLDER="ps/web"
  SPEC_FILE_PATH="apps/ps"
elif [[ $NAME == *"tbdpp-mobile-site"* ]]; then
  FOLDER="pp/web"
  SPEC_FILE_PATH="apps/pp"
elif [[ $NAME == *"tbdpp-native"* ]]; then
  FOLDER="pp/native"
  SPEC_FILE_PATH="apps/pp"
else
  FOLDER="bf/web"
  SPEC_FILE_PATH="apps/bf"
fi

VERSION=$(grep "%define version" $PWD/$SPEC_FILE_PATH/$NAME.spec | tr -s " \t\r" | cut -d " " -f 3)

rm -rf $PWD/target/rpm/
mkdir -p $PWD/target/rpm/{BUILD,RPMS,SPECS,SOURCES,SRPMS}

cp -r $PWD/apps/$FOLDER/dist/* $PWD/target/rpm/SOURCES/
rm -f $PWD/target/rpm/SOURCES/stats.json

if [ $ENV_BRANCH = "BRANCH" ]; then
  rpmbuild -ba \
    --define "_topdir $PWD/target/rpm/" \
    --define "_buildnumber ${BUILD_NUMBER}_BRANCH" \
    $SPEC_FILE_PATH/$NAME.spec
else
  rpmbuild -ba \
    --define "_topdir $PWD/target/rpm/" \
    --define "_buildnumber ${BUILD_NUMBER}" \
    $SPEC_FILE_PATH/$NAME.spec
fi
