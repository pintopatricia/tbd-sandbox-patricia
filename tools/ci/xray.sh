#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   sh tools/ci/xray.sh <test_exit_code>
#
# Requires env vars:
#   GITHUB_TOKEN
#   BUILD_URL (Jenkins sets this automatically)
#   JIRA_PROJECT_KEY
#   XRAY_TEST_PLAN_KEY
#   TEST_TYPE
#   BRAND
# Optional:
#   ENVIRONMENT (default: unknown)
#   PLATFORM (default: unknown)

TEST_EXIT_CODE="${1:-0}"

JUNIT_DIR="reports/junit"
ZIP_NAME="junit-results.zip"

REPO="Flutter-Global/tbd"
WORKFLOW_FILE="xray-import.yml"
REF="${BRANCH_NAME:-master}"

ENVIRONMENT="${ENVIRONMENT:-unknown}"
PLATFORM="${PLATFORM:-unknown}"

log()  { echo "[xray] $*"; }
warn() { echo "[xray] WARNING: $*" >&2; }

# ---- If we can't/shouldn't run, just exit with test status ----
if [ -z "${BUILD_URL:-}" ]; then warn "BUILD_URL missing; skipping."; exit "$TEST_EXIT_CODE"; fi
if [ -z "${GITHUB_TOKEN:-}" ]; then warn "GITHUB_TOKEN missing; skipping."; exit "$TEST_EXIT_CODE"; fi
if [ -z "${JIRA_PROJECT_KEY:-}" ] || [ -z "${XRAY_TEST_PLAN_KEY:-}" ] || [ -z "${TEST_TYPE:-}" ] || [ -z "${BRAND:-}" ]; then
  warn "Missing required XRAY inputs; skipping."
  exit "$TEST_EXIT_CODE"
fi

# ---- Zip JUnit ----
if [ -d "$JUNIT_DIR" ] && find "$JUNIT_DIR" -type f -name "*.xml" -print -quit | grep -q .; then
  rm -f "$ZIP_NAME"
  zip -qr "$ZIP_NAME" "$JUNIT_DIR"
  log "Created $ZIP_NAME"
else
  warn "No JUnit XML found in $JUNIT_DIR; skipping."
  exit "$TEST_EXIT_CODE"
fi

JUNIT_URL="${BUILD_URL}artifact/${ZIP_NAME}"
log "JUnit artifact URL: $JUNIT_URL"

API="https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches"

PAYLOAD="$(cat <<JSON
{
  "ref": "${REF}",
  "inputs": {
    "build_id": "${BUILD_NUMBER}",
    "build_url": "${BUILD_URL}",
    "junit_artifact_url": "${JUNIT_URL}",
    "jira_project_key": "${JIRA_PROJECT_KEY}",
    "xray_test_plan_key": "${XRAY_TEST_PLAN_KEY}",
    "test_type": "${TEST_TYPE}",
    "brand": "${BRAND}",
    "environment": "${ENVIRONMENT}",
    "platform": "${PLATFORM}",
    "execution_started_at": "${EXEC_STARTED_AT}",
    "execution_finished_at": "${EXEC_FINISHED_AT}",
    "execution_duration_seconds": "${DURATION_SECONDS}"
  }
}
JSON
)"

# ---- Trigger workflow ----
log "Triggering GitHub workflow..."

RESP_FILE="/tmp/xray_dispatch_resp.json"

set +e
HTTP_CODE=$(curl -sS -L \
  -o "$RESP_FILE" \
  -w "%{http_code}" \
  -X POST \
  -H "Authorization: token ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  "$API" \
  -d "$PAYLOAD")
CURL_EXIT=$?
set -e

log "curl exit: ${CURL_EXIT}, http: ${HTTP_CODE}"
log "response:"
cat "$RESP_FILE" || true

if [ "$CURL_EXIT" -eq 0 ] && [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
  log "GitHub workflow dispatched."
else
  warn "GitHub dispatch failed (non-fatal)."
fi

exit "$TEST_EXIT_CODE"
