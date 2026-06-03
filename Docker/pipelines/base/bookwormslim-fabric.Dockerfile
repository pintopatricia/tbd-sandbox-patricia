# Base image
FROM --platform=linux/amd64 artifactory-prd.prd.betfair/bff/fabric-bookworm-slim:27.20.0 as base

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN $GITHUB_TOKEN

ENV BASELINES_BRANCH="master"

WORKDIR /usr/app

USER root

RUN apt-get update
RUN apt-get install -y ca-certificates curl

RUN sed -i 's|http://deb.debian.org|https://artifactory-prd.prd.betfair/artifactory|g' /etc/apt/sources.list.d/debian.sources

RUN curl -k -o /usr/local/share/ca-certificates/vault-prd.prd.betfair-pki_prd.crt https://vault-prd.prd.betfair/v1/pki_prd/ca/pem
RUN curl -k -o /usr/local/share/ca-certificates/vault-prd.prd.betfair-pki_dev.crt https://vault-prd.prd.betfair/v1/pki_dev/ca/pem
RUN curl -k -o /usr/local/share/ca-certificates/zscaler-cert.crt https://artifactory-prd.prd.betfair/artifactory/surf/certs-mitm/ZscalerRootCertificate.pem
RUN chmod 644 /usr/local/share/ca-certificates/vault-prd.prd.betfair-pki_dev.crt /usr/local/share/ca-certificates/vault-prd.prd.betfair-pki_prd.crt /usr/local/share/ca-certificates/zscaler-cert.crt && update-ca-certificates

RUN apt-get update
RUN apt-get install apt-transport-https ca-certificates curl gnupg2 software-properties-common curl git build-essential python3 libzmq3-dev tini -y
RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian buster stable"

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/trusted.gpg.d/docker.gpg

RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/trusted.gpg.d/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN apt-get update
RUN apt-get install docker-ce docker-ce-cli containerd.io -y
