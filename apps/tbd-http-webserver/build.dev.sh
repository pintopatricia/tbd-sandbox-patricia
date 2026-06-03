#!/bin/bash
strand_dir=$(printf '%s\n' "${PWD##*/}")
major_version=$(cat package.json | grep -i "\"version\":" | cut -c15)
dist_dir="dist/$strand_dir-v$major_version"

mkdir -p $dist_dir/
cp package.json $dist_dir/
cp -r dist/es5/* $dist_dir/
cp -r .yalc/ $dist_dir/

cd $dist_dir

