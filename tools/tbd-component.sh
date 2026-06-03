#!/bin/bash

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Print usage message
usage() {
  echo "Usage: $0 <package-name> [--add|--remove] [--apps] [--shared] [--page-objects] [--all]"
  echo ""
  echo "Options:"
  echo "  --add (default)     : Install the package"
  echo "  --remove           : Uninstall the package"
  echo ""
  echo "Target selection (at least one required):"
  echo "  --apps             : Install/remove in app directories (bf/native, sbg/native)"
  echo "  --shared           : Install/remove in packages/tbd-shared"
  echo "  --page-objects    : Install/remove in packages/tbd-page-objects"
  echo "  --all              : Install/remove in all directories"
}

# Define directory groups
APP_DIRS=(
  "apps/bf/native"
  "apps/sbg/native"
)

SHARED_DIRS=(
  "packages/tbd-shared"
)

PAGE_OBJECTS_DIRS=(
  "packages/tbd-page-objects"
)

# Parse arguments
PACKAGE=""
ACTION="--add"
TARGET_APPS=false
TARGET_SHARED=false
TARGET_PAGE_OBJECTS=false
TARGET_ALL=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --add)
      ACTION="--add"
      shift
      ;;
    --remove)
      ACTION="--remove"
      shift
      ;;
    --apps)
      TARGET_APPS=true
      shift
      ;;
    --shared)
      TARGET_SHARED=true
      shift
      ;;
    --page-objects)
      TARGET_PAGE_OBJECTS=true
      shift
      ;;
    --all)
      TARGET_ALL=true
      shift
      ;;
    *)
      if [ -z "$PACKAGE" ]; then
        PACKAGE="$1"
      else
        echo "Unknown option: $1"
        echo ""
        usage
        exit 1
      fi
      shift
      ;;
  esac
done

# Validate package name is provided
if [ -z "$PACKAGE" ]; then
  echo "Error: Package name is required"
  echo ""
  usage
  exit 1
fi

# Validate at least one target option is specified
if [ "$TARGET_ALL" = false ] && [ "$TARGET_APPS" = false ] && [ "$TARGET_SHARED" = false ] && [ "$TARGET_PAGE_OBJECTS" = false ]; then
  echo "Error: At least one target option must be specified (--apps, --shared, --page-objects, or --all)"
  echo ""
  usage
  exit 1
fi

# Build target directories array based on selected options
DIRS=()

if [ "$TARGET_ALL" = true ]; then
  DIRS=("${APP_DIRS[@]}" "${SHARED_DIRS[@]}" "${PAGE_OBJECTS_DIRS[@]}")
else
  if [ "$TARGET_APPS" = true ]; then
    DIRS+=("${APP_DIRS[@]}")
  fi
  if [ "$TARGET_SHARED" = true ]; then
    DIRS+=("${SHARED_DIRS[@]}")
  fi
  if [ "$TARGET_PAGE_OBJECTS" = true ]; then
    DIRS+=("${PAGE_OBJECTS_DIRS[@]}")
  fi
fi

# Set yarn command and action verb
if [ "$ACTION" = "--remove" ]; then
  YARN_CMD="yarn remove"
  ACTION_VERB="removed"
else
  YARN_CMD="yarn add"
  ACTION_VERB="installed"
fi

# Track results
SUCCESSFUL=()
FAILED=()

# Process each directory
for dir in "${DIRS[@]}"; do
  if (cd "$dir" && $YARN_CMD "$PACKAGE"); then
    SUCCESSFUL+=("$dir")
  else
    FAILED+=("$dir")
  fi
done

# Print summary report
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SUMMARY REPORT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Package: $PACKAGE"
echo "Action: $ACTION_VERB"
echo ""

if [ ${#SUCCESSFUL[@]} -gt 0 ]; then
  echo "✓ Successful (${#SUCCESSFUL[@]}):"
  for dir in "${SUCCESSFUL[@]}"; do
    echo "    • $dir"
  done
  echo ""
fi

if [ ${#FAILED[@]} -gt 0 ]; then
  echo "✗ Failed (${#FAILED[@]}):"
  for dir in "${FAILED[@]}"; do
    echo "    • $dir"
  done
  echo ""
fi

echo "Total: ${#DIRS[@]} directories | Successful: ${#SUCCESSFUL[@]} | Failed: ${#FAILED[@]}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Exit with error code if any operations failed
if [ ${#FAILED[@]} -gt 0 ]; then
  exit 1
fi
