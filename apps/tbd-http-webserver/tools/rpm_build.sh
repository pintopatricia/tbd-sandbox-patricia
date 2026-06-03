#!/bin/bash
set -x
NAME=tbd-http-webserver
VERSION=$(grep "%define version" $PWD/$NAME.spec | tr -s " \t\r" | cut -d " " -f 3)

rm -rf $PWD/target/rpm/
mkdir -p $PWD/target/rpm/{BUILD,RPMS,SPECS,SOURCES,SRPMS}

cp -r $PWD/dist/**/* $PWD/target/rpm/SOURCES/

if [ $ENV_BRANCH = "BRANCH" ]; then
  rpmbuild -ba \
           --define "_topdir $PWD/target/rpm/" \
           --define "_buildnumber ${BUILD_NUMBER}_BRANCH" \
           $NAME.spec
else
  rpmbuild -ba \
           --define "_topdir $PWD/target/rpm/" \
           --define "_buildnumber ${BUILD_NUMBER}" \
           $NAME.spec
fi
