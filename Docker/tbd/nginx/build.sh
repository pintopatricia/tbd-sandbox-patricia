#!/bin/bash
docker buildx rm multi-platform-builder
docker buildx create --use --platform=linux/arm64,linux/amd64 --name multi-platform-builder --config buildkitd.toml
docker buildx inspect --bootstrap
docker buildx build --platform linux/amd64 --platform linux/arm64 -t docker.app.betfair/nginx/tbd-nginx-multi-arch . --push
