FROM docker.app.betfair/nginx/tbd-nginx-multi-arch

COPY ssl-cert/ /etc/nginx/ssl-cert/
COPY dev/webapp.d/qa.locations.conf /etc/nginx/conf.d/locations.conf
COPY dev/webapp.d/apitbdsbg-local.locations.conf /etc/nginx/conf.d/custom.locations.conf
COPY dev/nginx.reverseproxy.conf /etc/nginx/nginx.conf
COPY dev/environment.json /usr/share/nginx/app.environment.json
