#!/bin/bash

# The following script identifies dependencies changes, and if changes are detected:
# 1) checks if they are synced through all monorepo (https://jamiemason.github.io/syncpack/command/list-mismatches);
# 2) verifies the project is consistent (yarn.lock, node_modules and .yarn/cache) using yarn install --immutable-cache.
# 3) deduplicates dependencies with overlapping ranges (https://yarnpkg.com/cli/dedupe).
# 4) stages the yarn.lock and .yarn/cache after deduplication if there are changes.

RED="\033[1;31m"
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
NO_COLOR="\033[0m"

CHANGED_FILES_COUNT=$(git diff --name-only --cached | grep yarn.lock | cat | wc -w)

listPossibleMismatchedDependencies() {
  # Check for mismatched dependencies using syncpack
  yarn syncpack:list

  # Check return code from previous command
  if [ $? -eq 0 ]; then
    echo ${GREEN}
    echo "Cool! Everything is fine! No dependencies mismatches detected."
    echo ${NO_COLOR}
  else
    echo ${RED}
    echo "Ohhh! Some dependencies mismatches were detected. Please update them!\nYou can do it: Manually or using #yarn syncpack:fix" >&2
    echo ${NO_COLOR}
    exit 1
  fi
}

if [[ ${CHANGED_FILES_COUNT} -gt 0 ]]; then
  echo ${YELLOW}
  echo "Detected changes on the yarn.lock."
  echo ${NO_COLOR}

  # Check for mismatched dependencies
  listPossibleMismatchedDependencies

  # Run yarn install --immutable-cache to ensure everything is in sync before deduplication
  echo ${YELLOW}
  echo "Running yarn install --immutable-cache to ensure everything is in sync before deduplication."
  echo ${NO_COLOR}
  yarn install --immutable-cache >/dev/null 2>&1

  if [ $? -ne 0 ]; then
    # If yarn install --immutable-cache fails, prompt the user to fix inconsistencies manually
    echo ${RED}
    echo "Error: yarn.lock, node_modules, or cache is out of sync."
    echo "Please run 'yarn install' to fix the issue, and then try committing again."
    echo ${NO_COLOR}
    exit 1
  fi

  # Deduplicate dependencies
  yarn dedupe

  # Stage the updated yarn.lock and .yarn/cache after deduplication
  git add yarn.lock .yarn/cache

  echo ${GREEN}
  echo "Proceeding with the commit."
  echo ${NO_COLOR}

else
  echo ${GREEN}
  echo "No changes detected in yarn.lock. Proceeding with the commit."
  echo ${NO_COLOR}
fi

echo ${NO_COLOR}
exit 0
