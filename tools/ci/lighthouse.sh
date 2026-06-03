#!/bin/bash

set -e

TBD_USERNAME=Testapm
NODE_TLS_REJECT_UNAUTHORIZED=0
types=(gtm noGtm)
tokens=($LHCI_SERVER_BUILD_TOKEN_GTM $LHCI_SERVER_BUILD_TOKEN_NO_GTM)

git checkout ${CI_BUILD}

for index in ${!types[@]}; do
  docker container run -w /${types[$index]} -v "$PWD/.git:/${types[$index]}/.git" -v "$PWD/tools:/${types[$index]}/tools" -u root \
  -e PUPPETEER_SKIP_DOWNLOAD="true" \
  -e TBD_USERNAME=$TBD_USERNAME \
  -e TBD_PASSWORD=$TBD_PASSWORD \
  -e LHCI_SERVER_BUILD_TOKEN=${tokens[$index]} \
  -e TBD_URL=$TBD_URL \
  -e LHCI_BUILD_CONTEXT__CURRENT_BRANCH=$ENVIRONMENT \
  -e ENVIRONMENT=$ENVIRONMENT \
  -e NODE_TLS_REJECT_UNAUTHORIZED=0 \
  --rm --cap-add=SYS_ADMIN patrickhulce/lhci-client:0.9.0 \
  /bin/bash -c "npm install puppeteer@18; lhci autorun --config=./tools/apm/lighthouse/${types[$index]}/.lighthouserc.${ENVIRONMENT}.js" & pids[${index}]=$!
done

for pid in ${pids[*]}; do
    wait $pid
done
