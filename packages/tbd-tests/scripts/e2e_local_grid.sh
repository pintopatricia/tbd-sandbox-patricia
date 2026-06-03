#!/bin/bash

set -e

export NODE_TLS_REJECT_UNAUTHORIZED=0
export SELENIUM_HOST='localhost'
TESTS_FAILED=0

cd ../web
yarn grid:local:start
yarn ${TEST_PACK} || TESTS_FAILED=1
yarn grid:local:stop

exit $TESTS_FAILED