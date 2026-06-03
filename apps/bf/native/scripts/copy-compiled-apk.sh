#!/bin/sh

# $1 is passed as parameter and it is the type of android build (eg. inhouse, release, etc)
# create new ppb/tbdn/build-$1 container id.
container_id=$(docker create ppb/tbdn/build-$1)

# remove old dist folder
rm -rf android/app/build/outputs/apk/play/$1

# extract updated dist from docker container
docker cp $container_id:/usr/app/android/app/build/outputs/apk/play/$1/ ./android/app/build/outputs/apk/play/$1

# delete unused container
docker rm $container_id
