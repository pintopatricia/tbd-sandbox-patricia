#!/bin/bash

set -e

# Colors
GREEN='\033[1;32m'
BLUE='\033[1;36m'
RED='\033[1;31m'
NC='\033[0m' # No Color

SCHEMA_FILE="packages/tbd-store/state/betting/obb-betting/obb_schema.json"
TYPES_FILE="packages/tbd-store/state/betting/obb-betting/ObbBetting.types.ts"

if [ -f "$TYPES_FILE" ]; then
  if git diff --cached --name-only | grep -q "$TYPES_FILE"; then
    echo "${BLUE}OBB betting schema file staged for commit. Generating new schema...${NC}"

    npx ts-json-schema-generator \
      --tsconfig='tsconfig.json' \
      --path="$TYPES_FILE" \
      --expose='all' \
      --no-type-check \
      --type='ObbBettingState' \
      --jsDoc='none' \
      --minify \
      --out="$SCHEMA_FILE"

    if git diff --quiet "$SCHEMA_FILE"; then
      echo "${GREEN}No changes found in the OBB betting state schema.${NC}"
    else
      echo "${BLUE}Changes detected! New schema added to commit.${NC}"
      git add "$SCHEMA_FILE"
    fi
  else
    echo "${GREEN}No changes detected in OBB betting state schema. Proceeding with the commit.${NC}"
  fi
else
  echo "${RED}OBB betting state schema file not found in "$TYPES_FILE". Aborting...${NC}"
  exit 1
fi

echo "${NC}"
exit 0
