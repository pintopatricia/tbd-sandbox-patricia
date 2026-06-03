#!/bin/bash

set -e

BLUE='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

CHANGED_FILES=$(git diff --cached --name-only | grep -E '/tbd.*-site.spec$' | cat | wc -w)

if [[ $CHANGED_FILES -eq 1 ]]; then
  SPEC_FILE=$(git status | grep -E '/tbd.*-site.spec$')
  FILE=${SPEC_FILE##*/}
  echo "$RED"
  echo "Only the $FILE file was changed. Both tbd-mobile-site.spec and tbdsbg-mobile-site.spec need to be updated.$NC\n"
  exit 1
elif [[ $CHANGED_FILES -eq 2 ]]; then
  echo "$BLUE"
  echo "Spec files changed successfully!$NC\n"
fi
