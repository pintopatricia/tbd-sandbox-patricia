#!/bin/bash
strand_dir=$(printf '%s\n' "${PWD##*/}")
major_version=$(cat package.json | grep -i "\"version\":" | cut -c15)
dist_dir="dist/$strand_dir-v$major_version"

mkdir -p $dist_dir/
mkdir -p $dist_dir/node_modules/@ppb

cp package.json .npmrc ./lib/open-telemetry-sdk.js $dist_dir/

cp -r ../../packages/tbd-store/dist $dist_dir/node_modules/@ppb/tbd-store
cp -r ../../packages/tbd-store/package.json $dist_dir/node_modules/@ppb/tbd-store

cp -r dist/es5/* $dist_dir/

cd $dist_dir

npm install --production
