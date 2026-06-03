#!/bin/bash

echo "Use your AD credentials. You're welcome."
yarn vault-template-secrets-builder \
    -t apps/bf-tbd-http-bff-gql/config-templates/**/\*.json -o apps/bf-tbd-http-bff-gql/config/ \
    -t apps/tbd-http-webserver/config-templates/**/\*.json -o apps/tbd-http-webserver/config \
    -t apps/bf/native/tests/config-templates/login-local.json -o apps/bf/native/tests/config \
    -t packages/bff-performance-tests/config-templates/login-local.json -o packages/bff-performance-tests/conf \
    -t packages/tbd-tests/web/specs/e2e/bf/config-templates/nxt/login-local.json -o packages/tbd-tests/web/specs/e2e/bf/config/nxt \
    -t packages/tbd-tests/web/specs/e2e/bf/config-templates/prod/login-local.json -o packages/tbd-tests/web/specs/e2e/bf/config/prod \
    -t packages/tbd-tests/web/specs/e2e/sbg/config-templates/nxt/login-local.json -o packages/tbd-tests/web/specs/e2e/sbg/config/nxt \
    -t packages/tbd-tests/web/specs/e2e/sbg/config-templates/prod/login-local.json -o packages/tbd-tests/web/specs/e2e/sbg/config/prod \
    -t packages/tbd-tests/web/specs/e2e/ps/config-templates/nxt/login-local.json -o packages/tbd-tests/web/specs/e2e/ps/config/nxt \
    -t packages/tbd-tests/web/specs/e2e/ps/config-templates/prd/login-local.json -o packages/tbd-tests/web/specs/e2e/ps/config/prd \
    -t packages/tbd-tests/native/specs/e2e/bf/config-templates/nxt/login-local.json -o packages/tbd-tests/native/specs/e2e/bf/config/nxt \
    -t packages/tbd-tests/native/specs/e2e/bf/config-templates/prod/login-local.json -o packages/tbd-tests/native/specs/e2e/bf/config/prod \
    -t packages/tbd-tests/native/specs/e2e/sbg/config-templates/nxt/login-local.json -o packages/tbd-tests/native/specs/e2e/sbg/config/nxt \
    -t packages/tbd-tests/native/specs/e2e/sbg/config-templates/prod/login-local.json -o packages/tbd-tests/native/specs/e2e/sbg/config/prod \
    -t packages/tbd-tests/utils/xray-lint/config-templates/jira.json -o packages/tbd-tests/utils/xray-lint/config \
    -t packages/tbd-tests/native/specs/visual/baselines/bf/ios/config-templates/download-baselines.json -o packages/tbd-tests/native/specs/visual/baselines/bf/ios/config \
    -v https://vault-prd.prd.betfair/v1
