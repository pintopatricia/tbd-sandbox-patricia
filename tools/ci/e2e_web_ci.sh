#!/bin/bash

set -e

export NODE_TLS_REJECT_UNAUTHORIZED=0
yarn workspaces focus @ppb/tbd-tests
cd packages/tbd-tests/web
yarn ${SCRIPT_NAME}
