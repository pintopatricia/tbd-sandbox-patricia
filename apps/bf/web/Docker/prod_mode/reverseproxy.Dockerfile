#####################################################################################
# Launch TBD reverse proxy along with supervisord for monitoring - production ready #
#####################################################################################
FROM docker.app.betfair/nginx/tbd-nginx-multi-arch AS tbd-reverseproxy

ARG BRAND
ARG ENVIRONMENT_FOLDER=prod
ENV ENVIRONMENT_FOLDER=$ENVIRONMENT_FOLDER

RUN mkdir -p /run/nginx
RUN mkdir -p /var/log/nginx

COPY apps/${BRAND}/reverse-proxy/ssl-cert/ /etc/nginx/ssl-cert/
COPY apps/${BRAND}/reverse-proxy/${ENVIRONMENT_FOLDER}/nginx.reverseproxy.conf /etc/nginx/nginx.conf
COPY apps/${BRAND}/reverse-proxy/${ENVIRONMENT_FOLDER}/webapp.d/ /etc/nginx/conf.d/
COPY apps/${BRAND}/reverse-proxy/dev/environment.json /usr/share/nginx/app.environment.json
