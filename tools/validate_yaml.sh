#!/bin/bash

set -e

BLUE='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

CHANGED_FILES=$(git diff --cached --name-only | grep -E '^.github/.*\.yml' | cat | wc -w)

if [[ $CHANGED_FILES -gt 0 ]];
then
  if hash yamllint
  then
    echo "$BLUE"
    echo "YAML files changed, running linter... $NC\n"
    exec yamllint -c .github/.yamllint .github/
  else
    echo "$RED"
    echo "Seems YAMLLINT is not installed, cannot run checks on YAML files. Instructions on how to get YAMLLINT can be found here: https://yamllint.readthedocs.io/en/stable/quickstart.html#installing-yamllint$NC\n"
  fi
fi
