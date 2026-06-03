# Base image
FROM --platform=linux/amd64 artifactory-prd.prd.betfair/bff/fabric-bookworm-slim:27.20.0 as base

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN $GITHUB_TOKEN

ENV BASELINES_BRANCH="master"

USER root

## Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

USER node

