##############################
# Build TBDSBG production ready #
##############################
FROM docker.app.betfair/tbd-ci/base-image:master AS base

ARG GITHUB_TOKEN
ARG MONTEROSA_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN
ENV MONTEROSA_TOKEN=$MONTEROSA_TOKEN

# set working directory
WORKDIR /usr/app

FROM base AS yarn_install

#copy package.json
COPY ./.yarn ./.yarn
COPY .yarnrc.yml package.json yarn.lock ./
COPY ./packages/tbd-router/package.json ./packages/tbd-router/
COPY ./packages/tbd-shared/package.json ./packages/tbd-shared/
COPY ./packages/tbd-store/package.json ./packages/tbd-store/
COPY packages/wdio-lazy-element/package.json packages/wdio-lazy-element/
COPY packages/gql-doc-loader/ packages/gql-doc-loader/
COPY ./apps/sbg/web/package.json ./apps/sbg/web/

# install deps and
RUN yarn install
RUN yarn prepare

FROM yarn_install AS build

# build production-ready webapp distribution
COPY tools/ tools/
COPY babel.config.js .browserslistrc pql-manifest-sca.config.js pql-manifest-blh.config.js pql-manifest-catalogue.config.js ./
COPY packages/tbd-router/ packages/tbd-router/
COPY packages/tbd-shared/ packages/tbd-shared/
COPY packages/tbd-store/ packages/tbd-store/
COPY packages/gql-doc-loader/ packages/gql-doc-loader/
COPY apps/sbg/web/ apps/sbg/web/
RUN yarn build:local

############################################
# Launch TBD web server - production ready #
############################################
FROM docker.app.betfair/nginx/tbd-nginx-multi-arch

EXPOSE 9001

COPY apps/sbg/reverse-proxy/prod/nginx.webserver.conf /etc/nginx/nginx.conf
COPY --from=build /usr/app/apps/sbg/web/dist /usr/share/nginx/html
