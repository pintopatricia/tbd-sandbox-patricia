#!/bin/bash

set -e

# Expects GITHUB_TOKEN and WEBSERVER_BUILD_NUMBER in env
# (injected by Jenkins Vault and upstream job).

cd "$(git rev-parse --show-toplevel)"

[ -n "${GITHUB_TOKEN:-}" ] || { echo "GITHUB_TOKEN not set."; exit 1; }
git remote set-url origin "https://${GITHUB_TOKEN}@github.com/Flutter-Global/tbd.git"

GH_AUTH="Authorization: token ${GITHUB_TOKEN}"
EVENT_TYPE="webserver-bump"

dispatch_slack() {
  local pr_url="$1"
  curl -s -X POST \
    -H "${GH_AUTH}" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/Flutter-Global/tbd/dispatches" \
    -d "{\"event_type\":\"${EVENT_TYPE}\",\"client_payload\":{\"pr_url\":\"${pr_url}\"}}" \
    || echo "repository_dispatch failed (non-blocking)."
}

BUMP_BRANCH="chore/bump-webserver-${WEBSERVER_BUILD_NUMBER}"

if git ls-remote --exit-code origin "refs/heads/${BUMP_BRANCH}" >/dev/null 2>&1; then
  echo "Branch ${BUMP_BRANCH} already exists."
  EXISTING_PR=$(curl -s -H "${GH_AUTH}" \
    "https://api.github.com/repos/Flutter-Global/tbd/pulls?head=Flutter-Global:${BUMP_BRANCH}&state=open" \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print(d[0]['html_url'] if d else '')" 2>/dev/null || true)
  if [ -n "$EXISTING_PR" ]; then
    echo "Existing PR: ${EXISTING_PR}"
  fi
  exit 0
fi

node tools/update-webserver-build.js 2>&1 | tee update.log
EXIT=${PIPESTATUS[0]}
BUILD=$(grep '^build_number=' update.log 2>/dev/null | cut -d= -f2)
rm -f update.log

if [ "$EXIT" -eq 2 ]; then
  echo "No change needed."
  exit 0
fi
[ "$EXIT" -eq 0 ] || exit "$EXIT"

SPECS=$(git diff --name-only | grep '\.spec$' || true)
[ -n "$SPECS" ] || { echo "No .spec changes to commit."; exit 1; }

git checkout -b "${BUMP_BRANCH}"

echo "$SPECS" | xargs git add
git commit -m "feat: bump webserver build to ${BUILD} #NA"
git push origin "${BUMP_BRANCH}"

PR_URL=$(curl -s -X POST \
  -H "${GH_AUTH}" \
  -H "Content-Type: application/json" \
  "https://api.github.com/repos/Flutter-Global/tbd/pulls" \
  --data "{
    \"title\": \"feat: bump webserver build to ${BUILD} #NA\",
    \"body\": \"Automated bump triggered by tbd_http_webserver_ci_build build ${BUILD}.\",
    \"head\": \"${BUMP_BRANCH}\",
    \"base\": \"master\"
  }" | python3 -c "import sys,json; print(json.load(sys.stdin)['html_url'])")

echo "PR created: ${PR_URL}"
dispatch_slack "${PR_URL}"
