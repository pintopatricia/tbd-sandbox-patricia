#!/bin/bash

set -e

mkdir apps/bf/native/dist
cp packages/tbd-store/clients/catalogue/extracted_queries*.json apps/bf/native/dist
sh ./tools/rpm_build.sh tbd$1-native && node tools/cimanifest.js tbd$1-native
