#!/bin/sh

# create new ppb/tbd/bff/http-webserver container
container_id=$(docker create ppb/tbd/bff/http-webserver)

# remove old dist folder
rm -rf dist/

# extract updated dist from docker container
docker cp $container_id:/fabric/deploy/tbd-http-webserver/dist/ ./dist/

# delete unused container
docker rm $container_id
