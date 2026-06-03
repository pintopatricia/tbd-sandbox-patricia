FROM docker.app.betfair/library/node:24.14-alpine

# bookworm-slim fix
ENV PATH=$PATH:/var/app/tbd/node_modules/.bin

RUN apk add --no-cache curl

COPY --from=ppb/tbd/bff/tests/http-webserver-proxy /var/app/tbd /var/app/tbd

WORKDIR /var/app/tbd/apps/tbd-http-webserver

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

COPY ./Docker/tests/run-all-tests.sh ./
