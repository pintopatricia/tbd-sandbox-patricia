#####################################################################################
# Launch TBDSBG reverse proxy along with supervisord for monitoring - production ready #
#####################################################################################
FROM artifactory-prd.prd.betfair/nginx/tbd-nginx AS tbd-reverseproxy

ARG ENVIRONMENT_FOLDER=prod

RUN mkdir -p /run/nginx
RUN mkdir -p /var/log/nginx

COPY apps/sbg/reverse-proxy/ssl-cert/ /etc/nginx/ssl-cert/
COPY apps/sbg/reverse-proxy/${ENVIRONMENT_FOLDER}/nginx.reverseproxy.conf /etc/nginx/nginx.conf
COPY apps/sbg/reverse-proxy/prod/webapp.d/ /etc/nginx/conf.d/