#!/bin/sh
## Usage: ./select.sh

currentDir="$(dirname "$0")"
. "$currentDir/../utils.sh"

brand=${BRAND:-bf}
cd ../../../apps/$brand/native/

request_simulators
request_environments
