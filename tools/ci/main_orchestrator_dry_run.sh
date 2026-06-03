#!/bin/bash

set -e

BLUE='\033[0;36m'
YELLOW='\033[0;33m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

lastCommit=`git rev-parse master` # default value for last commit, latest master commit (covers all cases except commits to master branch)
currentCommit=`git rev-parse HEAD`

if [[ $currentCommit = $lastCommit ]] # compare current commit to latest master commit
then
  lastCommit=`git rev-parse HEAD~1` # in the case of a commit to master, both vars will point to the same commit, so lastCommit needs to be set to second to last
else
  lastCommit=`git rev-parse master` # otherwise, default lastCommit value can be used
fi

#if commit was automatically generated, update lastCommit value but do not execute orchestrator
CISKIP=`git log -1 --pretty=%B | grep -vE '\[ci-skip\]'`

if [[ -z $CISKIP ]];
then
  echo "Automatically generated commit, no orchestrator run needed. Exiting."
  exit 0;
fi

# Remove previous versions of files, so that builds don't bleed into each other
> diff.txt
> remainder.txt
> native.txt
> bff.txt
> changes.txt
> common_icons.txt
> user_context.txt

######################################
# END OF EXTRACTED QUERIES ASSESSMENT#
######################################

#############
# GET DIFFS #
#############

CHANGED_FILES_LIST=$(git log --author='^(?!Jenkins).*$' --perl-regexp --name-only --pretty=format: $lastCommit..$currentCommit | sort | uniq | grep -v -E '^.github/.*' | grep -v -E '^docs/.*' | grep -v -E '.*\.md' | grep -v -E '.*/ci/.*' | grep -v -E '.*jest.config.js' | grep -v -E '.*test\..*' | grep -v -E '.*gitignore' | grep -v -E '\.huskyrc' | cat)

CHANGED_FILES=$(echo "$CHANGED_FILES_LIST" | wc -w)

if [[ -z $1 ]]; then echo "$YELLOW \nNumber of valid changes:$NC $CHANGED_FILES"; fi

########################
# END OF GETTING DIFFS #
########################

####################
# VALIDATE CHANGES #
####################
if [[ $CHANGED_FILES -gt 0 ]];
then
  if [[ -z $1 ]]; then echo "$YELLOW \nList of valid changes:\n$BLUE$CHANGED_FILES_LIST $NC"; fi

  if [[ -z $1 ]]; then echo "$CHANGED_FILES_LIST">>changes.txt;fi

  if [[ -z $1 ]]; then echo "\nChecking if changes are to native spec files only...\n"; fi

  NATIVE_SPECS_CHANGED_FILES=$(echo "$CHANGED_FILES_LIST" | grep -E '^(apps\/native\/(.*spec.*|tests/config/wdio/conf.blacklist.js))' | wc -w) # look for native specs only

  if [[ $NATIVE_SPECS_CHANGED_FILES -eq $CHANGED_FILES ]];
  then
    ONLY_NATIVE_SPECS_CHANGED=true
    if [[ -z $1 ]]; then echo "ONLY_NATIVE_SPECS_CHANGED=$ONLY_NATIVE_SPECS_CHANGED"; fi
    BFF_CHANGED_FILES=0;
    if [[ -z $1 ]]; then echo "BFF_CHANGED_FILES=$BFF_CHANGED_FILES"; fi
    NATIVE_CHANGED_FILES=0;
    if [[ -z $1 ]]; then echo "NATIVE_CHANGED_FILES=$NATIVE_CHANGED_FILES"; fi
    CLIENT_CHANGED_FILES=0
    if [[ -z $1 ]]; then echo "CLIENT_CHANGED_FILES=$CLIENT_CHANGED_FILES"; fi
    if [[ -z $1 ]]; then echo "\n"; fi
    if [[ -z $1 ]]; then echo "Only native tests changed, triggering test jobs and quitting orchestrator...\n"; fi
    exit 0;
  else
    ONLY_NATIVE_SPECS_CHANGED=false
  fi;
  if [[ -z $1 ]]; then echo "ONLY_NATIVE_SPECS_CHANGED=$ONLY_NATIVE_SPECS_CHANGED"; fi


  if [[ -z $1 ]]; then echo "Looking for changes in BFF files..."; fi
  BFF_CHANGED_FILES_LIST=$(echo "$CHANGED_FILES_LIST" | grep -E '^((apps\/(tbd-http-webserver))\/.*|packages\/tbd-store\/.*)' | cat) # look for BFF files and changes to extracted queries

  if [[ $(echo "$BFF_CHANGED_FILES_LIST" | wc -w) -gt 0 ]];
  then
    BFF_CHANGED_FILES=$(echo "$BFF_CHANGED_FILES_LIST" | wc -w)
    echo "$BFF_CHANGED_FILES_LIST">>bff.txt # write bff changes to file
    echo "$BFF_CHANGED_FILES_LIST">>diff.txt # write bff changes to a generic diff file
  else
    BFF_CHANGED_FILES=0;
    if [[ -z $1 ]]; then echo "No changes found."; fi
  fi;

  if [[ -z $1 ]]; then echo "\nLooking for changes in native files..."; fi
  NATIVE_CHANGED_FILES_LIST=$(echo "$CHANGED_FILES_LIST" | grep -v -E '^(packages\/tbd-shared\/.*web.*|packages\/tbd-shared\/.*css|packages\/tbd-shared\/.*json)' | grep -E '^((packages\/tbd-shared|apps\/native|Docker\/tbdn)\/.*|tbd-native.spec|packages\/(tbd-store\/clients\/catalogue\/extracted_queries_v.*))' | cat) # look for changes to connected components and native files, excluding web-only files

  if [[ $(echo "$NATIVE_CHANGED_FILES_LIST" | wc -w) -gt 0 ]];
  then
    NATIVE_CHANGED_FILES=$(echo "$NATIVE_CHANGED_FILES_LIST" | wc -w)
    echo "$NATIVE_CHANGED_FILES_LIST">>native.txt # write native changes to file
    NATIVE_ONLY_FILES_CHANGED_FILES_LIST=$(echo "$NATIVE_CHANGED_FILES_LIST" | grep -E '^((apps\/native|Docker\/tbdn)\/.*|tbd-native.spec|packages\/(tbd-shared\/.*native.*|tbd-store\/clients\/catalogue\/extracted_queries_v.*))' | cat) # look for changes to connected components and native files, excluding web-only files
    echo "$NATIVE_ONLY_FILES_CHANGED_FILES_LIST">>diff.txt # write native only changes to file; this way, changes to files shared between web and native will trigger both web and native
  else
    NATIVE_CHANGED_FILES=0;
    if [[ -z $1 ]]; then echo "No changes found."; fi
  fi;

  if [[ -z $1 ]]; then echo "$YELLOW \nChecking TBD-Store... $NC"; fi # changes to TBD-Store should result in builds for both web and native
  STORE_CHANGED_FILES_LIST=$(echo "$CHANGED_FILES_LIST" | grep -E '^packages\/tbd-store\/.*' | grep -v -E '^packages\/tbd-store\/clients\/catalogue\/extracted_queries.json' | cat) # look for changes to TBD-Store besides extracted_queries

  if [[ $(echo "$STORE_CHANGED_FILES_LIST" | wc -w) -gt 0 ]];
  then
    STORE_CHANGED_FILES=$(echo "$STORE_CHANGED_FILES_LIST" | wc -w)
    echo "$STORE_CHANGED_FILES_LIST">>native.txt # write native changes to file (create if non-existetnt, overwrite otherwise)
  else
    STORE_CHANGED_FILES=0
    if [[ -z $1 ]]; then echo "No changes found."; fi
  fi;
  if [[ -z $1 ]]; then echo "NATIVE_CHANGED_FILES=$NATIVE_CHANGED_FILES"; fi

  if [[ -z $1 ]]; then echo "$YELLOW \nChecking TBD-Shared... $NC"; fi # changes to common elements of connected components should result in builds for both web and native
  SHARED_CHANGED_FILES_LIST=$(echo "$CHANGED_FILES_LIST" | grep -v -E '^(packages\/tbd-shared\/.*web.*|packages\/tbd-shared\/.*native.*)' | grep -E '^(packages\/tbd-shared\/.*)' | cat) # look for changes to common elements of connected components
  if [[ $(echo "$SHARED_CHANGED_FILES_LIST" | wc -w) -gt 0 ]];
  then
    SHARED_CHANGED_FILES=$(echo "$SHARED_CHANGED_FILES_LIST" | wc -w)
  else
    SHARED_CHANGED_FILES=0
    if [[ -z $1 ]]; then echo "No changes found."; fi
  fi;

  CLIENT_CHANGED_FILES=$(($CHANGED_FILES-$BFF_CHANGED_FILES-$NATIVE_CHANGED_FILES)) && true # some files should trigger web and native builds and so need to be added to the list of files to trigger client builds

  if [[ -z $1 ]]; then echo "CLIENT_CHANGED_FILES=$CLIENT_CHANGED_FILES"; fi

  $(cat changes.txt | sort -ubo changes.txt) # sort file contents ignoring blank spaces and removing duplicates; overwrite file with changes

  $(cat diff.txt | sort -ubo diff.txt) # sort file contents ignoring blank spaces and removing duplicates; overwrite file with changes

  $(comm -3 changes.txt diff.txt>remainder.txt) # write diff between global chnages and generic diff file to a new file

  if [[ ! -s remainder.txt ]];
  then
   cat changes.txt > remainder.txt
  fi

#############################
# END OF VALIDATE CHANGES #
#############################

else
  CHANGED_FILES=0;
  ONLY_NATIVE_SPECS_CHANGED=false
  BFF_CHANGED_FILES=0;
  NATIVE_CHANGED_FILES=0;
  CLIENT_CHANGED_FILES=0
  STORE_CHANGED_FILES=0
  SHARED_CHANGED_FILES=0
fi;

#################
# PRINT SUMMARY #
#################
if [[ -z $1 ]]; then echo "$YELLOW\n>>> SUMMARY OF CHANGES FOUND: $NC"; fi
if [[ -z $1 ]]; then echo "STORE_CHANGED_FILES=$STORE_CHANGED_FILES"; fi
if [[ -z $1 ]]; then echo "SHARED_CHANGED_FILES=$SHARED_CHANGED_FILES"; fi
if [[ -z $1 ]]; then echo "CHANGED_FILES=$(echo $CHANGED_FILES)"; fi
if [[ -z $1 ]]; then echo "ONLY_NATIVE_SPECS_CHANGED=$ONLY_NATIVE_SPECS_CHANGED"; fi
if [[ -z $1 ]]; then echo "BFF_CHANGED_FILES=$BFF_CHANGED_FILES"; fi
if [[ -z $1 ]]; then echo "NATIVE_CHANGED_FILES=$NATIVE_CHANGED_FILES"; fi
if [[ -z $1 ]]; then echo "CLIENT_CHANGED_FILES=$CLIENT_CHANGED_FILES"; fi

if test $BFF_CHANGED_FILES -gt 0 -o $NATIVE_CHANGED_FILES -gt 0 -o $CLIENT_CHANGED_FILES -gt 0;
then
  if [[ -z $1 ]]; then echo "$YELLOW\nTHIS BUILD WOULD TRIGGER:$NC"; else echo "$YELLOW\nBUILD WILL TRIGGER:$NC"; fi
  if [[ $BFF_CHANGED_FILES -gt 0 ]];
  then
    echo "$PURPLE > BFF Orchestrator$NC"
  fi
  if [[ $(($NATIVE_CHANGED_FILES+$STORE_CHANGED_FILES)) -gt 0 ]];
  then
    echo "$PURPLE > Native Orchestrator$NC"
  fi
  if [[ $(($CLIENT_CHANGED_FILES+$STORE_CHANGED_FILES+$SHARED_CHANGED_FILES)) -gt 0 ]];
  then
    echo "$PURPLE > Web Orchestrator$NC"
  fi
else
  if [[ -z $1 ]]; then echo "$YELLOW\nThis build will trigger no orchestrators$NC"; else echo "$YELLOW\nThis build would trigger no orchestrators$NC"; fi
fi

echo " "
