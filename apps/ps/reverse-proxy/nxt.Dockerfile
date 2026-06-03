FROM docker.app.betfair/nginx/tbd-nginx-multi-arch

ARG ENVIRONMENT_FOLDER=dev
# dev is the default value, but some files require folders set in runtime, such as AWS

COPY ssl-cert/ /etc/nginx/ssl-cert/
COPY ${ENVIRONMENT_FOLDER}/webapp.d/nxt.locations.conf /etc/nginx/conf.d/locations.conf
COPY dev/webapp.d/apitbd-local.locations.conf /etc/nginx/conf.d/custom.locations.conf
COPY ${ENVIRONMENT_FOLDER}/nginx.reverseproxy.conf /etc/nginx/nginx.conf
