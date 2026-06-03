ARG VERSION=latest
FROM docker.app.betfair/ppb/tbd/bff/bff-gql:${VERSION}

ARG BRAND=bf
ARG ENVIRONMENT=qa
ENV BRAND=${BRAND}
ENV ENVIRONMENT=${ENVIRONMENT}

USER root

COPY --chown=node:node apps/bf-tbd-http-bff-gql/config/bff-gql-http-${BRAND}-${ENVIRONMENT}.json /etc/bf-fabric/bff-gql-http.json
COPY --chown=node:node apps/bf-tbd-http-bff-gql/config/certificates /etc/bf-fabric/certificates
COPY --chown=node:node apps/bf-tbd-http-bff-gql/src/config/* /app/dist/config/

USER node

EXPOSE 8082
ENTRYPOINT ["dumb-init", "node", "--abort-on-uncaught-exception", "--enable-experimental-regexp-engine-on-excessive-backtracks", "--", "dist/bin.js"]
CMD ["/etc/bf-fabric/bff-gql-http.json"]
