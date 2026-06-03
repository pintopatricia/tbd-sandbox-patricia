#!/bin/bash

set -e

mkdir apps/pp/native/dist
cp packages/tbd-store/clients/catalogue/extracted_queries*.json apps/pp/native/dist
sh ./tools/rpm_build.sh tbdpp-native && node tools/cimanifest.js tbdpp-native