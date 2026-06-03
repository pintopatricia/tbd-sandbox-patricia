FROM docker.app.betfair/nginx/tbd-nginx-multi-arch

ARG ENVIRONMENT_FOLDER=dev

COPY ssl-cert/ /etc/nginx/ssl-cert/
COPY ${ENVIRONMENT_FOLDER}/webapp.d/qa.locations.conf /etc/nginx/conf.d/locations.conf
COPY dev/webapp.d/apitbdsbg-local.locations.conf /etc/nginx/conf.d/custom.locations.conf
COPY ${ENVIRONMENT_FOLDER}/nginx.reverseproxy.conf /etc/nginx/nginx.conf
COPY dev/environment.qa.json /usr/share/nginx/app.environment.json
