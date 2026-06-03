#!/bin/bash

set -e

mkdir apps/sbg/native/dist
cp packages/tbd-store/clients/catalogue/extracted_queries*.json apps/sbg/native/dist
sh ./tools/rpm_build.sh tbdsbg-native && node tools/cimanifest.js tbdsbg-native
