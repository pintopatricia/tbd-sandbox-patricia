# m1 fix
FROM --platform=linux/amd64 ppb/tbd/bff/http-webserver:latest

WORKDIR /var/app/tbd/apps/tbd-http-webserver

COPY regression-tests ./regression-tests
COPY jest.config.js .

COPY regression-tests/config/header-strategies/admin.js /fabric/node_modules/@ppb/fabric-envelope/lib/header-strategies/admin.js
COPY regression-tests/config/header-strategies/basic.js /fabric/node_modules/@ppb/fabric-envelope/lib/header-strategies/basic.js

ENTRYPOINT ["/usr/bin/tini", "--"]
