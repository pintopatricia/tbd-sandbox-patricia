#!/bin/bash

set -e

> additions.txt
> deletions.txt
> deleted_queries.txt

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

MODE=$1 # CI or Default
EXTRACTED_QUERIES="packages/tbd-store/clients/catalogue/extracted_queries_v*"

echo "Validating queries..."

cleanup() {
  rm deletions.txt additions.txt deleted_queries.txt added_queries.txt
}

if [[ $MODE == "ci" ]]
then
  git diff $lastCommit $GIT_COMMIT -- $EXTRACTED_QUERIES | grep -oE '^[+]  "(.*?)"' | grep -oE '[^"+]*' | grep -vE " " | sort -ubo additions.txt | cat > additions.txt
  git diff $lastCommit $GIT_COMMIT -- $EXTRACTED_QUERIES | grep -oE '^-  "(.*?)"' | grep -oE '[^"-]*' | grep -vE " " | sort -ubo deletions.txt | cat > deletions.txt
else
  git diff --cached $EXTRACTED_QUERIES | grep -oE '^[+]  "(.*?)"' | grep -oE '[^"+]*' | grep -vE " " | sort -ubo additions.txt | cat > additions.txt
  git diff --cached $EXTRACTED_QUERIES | grep -oE '^-  "(.*?)"' | grep -oE '[^"-]*' | grep -vE " " | sort -ubo deletions.txt | cat > deletions.txt
fi

comm -23 deletions.txt additions.txt > deleted_queries.txt # write diff between deletions and additions
comm -23 additions.txt deletions.txt > added_queries.txt # write diff between deletions and additions

if [ -s added_queries.txt ];
then
  echo "${GREEN}The following queries were added:${NC}"
  comm -23 additions.txt deletions.txt # output added queries and ignore the updated ones
  echo " "
fi;

if [ -s deleted_queries.txt ];
then
  echo "${RED}QUERIES WERE DELETED. ABORTING..."
  cat deleted_queries.txt
  echo ${NC}
  cleanup
  exit 1
fi;

cleanup
