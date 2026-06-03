###############################
# Development Mode Dockerfile #
###############################
FROM docker.app.betfair/node:24.15.0-bookworm-slim

ARG GITHUB_TOKEN
ARG MONTEROSA_TOKEN
ARG BUNDLER_WEBSOCKET_URL

ENV BRAND=$BRAND
ENV ENVIRONMENT=$ENVIRONMENT
ENV GITHUB_TOKEN=$GITHUB_TOKEN
ENV MONTEROSA_TOKEN=$MONTEROSA_TOKEN
ENV BUNDLER_WEBSOCKET_URL=$BUNDLER_WEBSOCKET_URL

USER root

# Combine apt commands for better caching
RUN apt-get update --fix-missing && apt-get install -y --no-install-recommends build-essential libpango1.0-dev curl && \
    curl -sk "https://artifactory-prd.prd.betfair/artifactory/surf/certs-mitm/ZscalerRootCertificate.pem" --output /tmp/ZscalerRootCertificate.pem && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_EXTRA_CA_CERTS="/tmp/ZscalerRootCertificate.pem"

# set working directory
WORKDIR /usr/app

ENV PATH /usr/app/node_modules/.bin:$PATH

# copy the whole .yarn folder
COPY ./.yarn ./.yarn

# install node dependencies - copy all package.json files at once for better caching
COPY .yarnrc.yml package.json yarn.lock ./
COPY packages/tbd-router/package.json packages/tbd-router/
COPY packages/tbd-shared/package.json packages/tbd-shared/
COPY packages/tbd-store/package.json packages/tbd-store/
COPY packages/wdio-lazy-element/package.json packages/wdio-lazy-element/

# Copy ALL brand package.json files at once (prevents cache invalidation on brand switch)
COPY apps/bf/web/package.json apps/bf/web/

# local yalc packages - Using a glob pattern to prevent copying .yalc folder when it is not present
COPY packages/tbd-shared/.yal[c] packages/tbd-shared/.yalc
COPY packages/tbd-store/.yal[c] packages/tbd-store/.yalc
COPY apps/bf/web/.yal[c] apps/bf/web/.yalc

RUN yarn workspaces focus @ppb/tbdbf-webapp
COPY ./tools ./tools
COPY babel.config.js .browserslistrc pql-manifest-sca.config.js pql-manifest-blh.config.js pql-manifest-catalogue.config.js ./

# Set working directory to the brand-specific web app
WORKDIR /usr/app/apps/${BRAND}/web

EXPOSE 9001

# Launch nginx as reverse proxy and start TBD app (web servers)
CMD BUNDLER_WEBSOCKET_URL=$BUNDLER_WEBSOCKET_URL yarn start:webserver
