# Base image
FROM docker.app.betfair/node:24.15.0-bookworm-slim

ARG GITHUB_TOKEN
ARG MONTEROSA_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN
ENV MONTEROSA_TOKEN=$MONTEROSA_TOKEN

USER root

RUN apt update \
  && apt install build-essential libpango1.0-dev -y \
  && apt clean

# set working directory
WORKDIR /usr/app

ENV PATH /usr/app/node_modules/.bin:$PATH

# copy the whole .yarn folder
COPY ./.yarn ./.yarn

# install node dependencies
COPY .yarnrc.yml package.json yarn.lock ./
COPY packages/tbd-router/package.json packages/tbd-router/
COPY packages/tbd-shared/package.json packages/tbd-shared/
COPY packages/tbd-store/package.json packages/tbd-store/
COPY packages/wdio-lazy-element/package.json packages/wdio-lazy-element/
COPY apps/pp/web/package.json apps/pp/web/

# local yalc packages - Using a glob pattern to prevent copying .yalc folder when it is not present
COPY packages/tbd-shared/.yal[c] packages/tbd-shared/.yalc
COPY apps/pp/web/.yal[c] apps/pp/web/.yalc

RUN yarn workspaces focus @ppb/tbdpp-webapp

COPY ./tools ./tools
COPY babel.config.js .browserslistrc pql-manifest-sca.config.js pql-manifest-blh.config.js pql-manifest-catalogue.config.js ./

EXPOSE 9001

# Launch nginx as reverse proxy and start TBD app (web servers)
CMD ["yarn", "start:webserver" ]
