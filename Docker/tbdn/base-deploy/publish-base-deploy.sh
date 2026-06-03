#!/bin/bash
if [ -z "$1" ]
then
  echo "Please specify the new image version to be published";
  exit 1;
else
  docker build -t ppb/tbdn/base-deploy:$1 -f Docker/tbdn/base-deploy/base-deploy.Dockerfile .
  docker tag ppb/tbdn/base-deploy:$1 ppb/tbdn/base-deploy:latest
  docker tag ppb/tbdn/base-deploy:$1 artifactory-prd.prd.betfair/ppb/tbdn/base-deploy:$1
  docker tag ppb/tbdn/base-deploy:$1 artifactory-prd.prd.betfair/ppb/tbdn/base-deploy:latest
  docker image push --all-tags artifactory-prd.prd.betfair/ppb/tbdn/base-deploy
fi
