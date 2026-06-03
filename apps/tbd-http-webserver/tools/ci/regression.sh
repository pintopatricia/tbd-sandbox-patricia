#!/bin/bash

set -e

cd apps/tbd-http-webserver/
make build-ci-regression
make publish