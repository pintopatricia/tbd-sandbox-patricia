#!/bin/bash

set -e

export NODE_TLS_REJECT_UNAUTHORIZED=0

JOB_NUMBER=${ANDROID_BUILD_NUMBER:-$BUILD_NUMBER}

container_ids=$(docker ps --format "{{.ID}}" --filter "name=^${JOB_NAME}_${JOB_NUMBER}_")

if [ -n "$container_ids" ]; then
    docker kill $container_ids
fi
