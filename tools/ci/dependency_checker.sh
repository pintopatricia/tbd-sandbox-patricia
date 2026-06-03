#!/bin/bash

#This script will check all the spec files to make sure that the dependency packages exist within artifactory.

for file in ./apps/bf/*.spec ./apps/sbg/*.spec
do
echo
echo Checking the following file $file

#checks for fabric version in artifactory
FABRIC=$(awk '$1 ~ /^Requires:/ {printf "%s=%s\n", $2, $4}' $file | grep bf-fabric* | cut -c 11-)
echo expected fabric package = $FABRIC
FABRIC_ARTIFACTORY=$(curl -s https://artifactory-prd.prd.betfair/artifactory/fabric-repo/8/x86_64/ | grep -o $FABRIC | head -1)
if [[ -n $FABRIC_ARTIFACTORY ]]; then
    echo actual fabric package = $FABRIC_ARTIFACTORY
else
    echo Could not fetch version $FABRIC from artifactory
    exit 1
fi

#check for GQL version11 in artifactory
GQL=$(awk '$1 ~ /^Requires:/ {printf "%s=%s\n", $2, $4}' $file | grep gql-v11 | cut -c 25-)
echo expected GQL v11 = $GQL
GQL_ARTIFACTORY=$(curl -s https://artifactory-prd.prd.betfair/artifactory/tbd-bff/ | grep -o $GQL | head -1)
if [[ -n $GQL_ARTIFACTORY ]]; then
    echo actual GQL v11 = $GQL_ARTIFACTORY
else
    echo Could not fetch version $GQL from artifactory
    exit 1
fi

  #This one is specific to mobile
  if [[ $file == *mobile* ]]; then
    #check for webserver in artifactory but only for mobile site specs
    WEBSERVER=$(awk '$1 ~ /^Requires:/ {printf "%s=%s\n", $2, $4}' $file | grep webserver* | cut -c 26-)
    echo expected webserver = $WEBSERVER
    WEBSERVER_ARTIFACTORY=$(curl -s https://artifactory-prd.prd.betfair/artifactory/tbd-bff/x86_64/ | grep -o $WEBSERVER | head -1)
    if [[ -n $WEBSERVER_ARTIFACTORY ]]; then
        echo actual webserver = $WEBSERVER_ARTIFACTORY
    else
        echo Could not fetch version $WEBSERVER from artifactory
        exit 1
    fi
  fi
done
