#!/bin/bash
# Validate bidirectional sync between config/bf/assets and assets, and config/bf/translations/generated and generated/translations
# This script ensures that whenever files are modified in one directory,
# the corresponding files in the other directory are also modified.

set -e

CONFIG_ASSETS_PREFIX="apps/bf/web/config/bf/assets"
ASSETS_PREFIX="apps/bf/web/assets"
CONFIG_TRANSLATIONS_PREFIX="apps/bf/web/config/bf/translations/generated"
TRANSLATIONS_PREFIX="apps/bf/web/generated/translations"

# Get all modified/added/deleted files in the staging area using git diff-index
CHANGED_CONFIG_ASSETS=$(git diff-index --cached --name-only --diff-filter=ACM HEAD -- "$CONFIG_ASSETS_PREFIX" 2>/dev/null || echo "")
CHANGED_ASSETS=$(git diff-index --cached --name-only --diff-filter=ACM HEAD -- "$ASSETS_PREFIX" 2>/dev/null || echo "")
CHANGED_CONFIG_TRANSLATIONS=$(git diff-index --cached --name-only --diff-filter=ACM HEAD -- "$CONFIG_TRANSLATIONS_PREFIX" 2>/dev/null || echo "")
CHANGED_TRANSLATIONS=$(git diff-index --cached --name-only --diff-filter=ACM HEAD -- "$TRANSLATIONS_PREFIX" 2>/dev/null || echo "")

if [ -z "$CHANGED_CONFIG_ASSETS" ] && [ -z "$CHANGED_ASSETS" ] && [ -z "$CHANGED_CONFIG_TRANSLATIONS" ] && [ -z "$CHANGED_TRANSLATIONS" ]; then
  # No changes to any directory, we're good
  exit 0
fi

ERROR_FOUND=0

# ============================================================================
# ASSETS VALIDATION
# ============================================================================

# Check 1: Each file in config/bf/assets must have a corresponding file in assets
while IFS= read -r config_file; do
  [ -z "$config_file" ] && continue
  
  # Extract the relative path from config/bf/assets
  relative_path="${config_file#$CONFIG_ASSETS_PREFIX/}"
  # Expected corresponding file in assets
  expected_assets_file="$ASSETS_PREFIX/$relative_path"

  # Check if the corresponding file exists in changed assets files
  if ! echo "$CHANGED_ASSETS" | grep -Fxq "$expected_assets_file"; then
    echo "❌ Error: Modified file in config/bf/assets has no corresponding change in assets/"
    echo "   Config file: $config_file"
    echo "   Expected asset file: $expected_assets_file"
    echo "   If this not intended, please make sure to modify the corresponding file in assets/ as well."
    ERROR_FOUND=1
  fi
done <<< "$CHANGED_CONFIG_ASSETS"

# Check 2: Each file in assets must have a corresponding file in config/bf/assets
while IFS= read -r assets_file; do
  [ -z "$assets_file" ] && continue
  
  # Extract the relative path from assets
  relative_path="${assets_file#$ASSETS_PREFIX/}"
  
  # Expected corresponding file in config/bf/assets
  expected_config_file="$CONFIG_ASSETS_PREFIX/$relative_path"
  
  # Check if the corresponding file exists in changed config files
  if ! echo "$CHANGED_CONFIG_ASSETS" | grep -Fxq "$expected_config_file"; then
    echo "❌ Error: Modified file in assets has no corresponding change in config/bf/assets/"
    echo "   Asset file: $assets_file"
    echo "   Expected config file: $expected_config_file"
    echo "   If this not intended, please make sure to modify the corresponding file in config/bf/assets/ as well."
    ERROR_FOUND=1
  fi
done <<< "$CHANGED_ASSETS"

# ============================================================================
# TRANSLATIONS VALIDATION
# ============================================================================

# Check 3: Each file in config/bf/translations/generated must have a corresponding file in generated/translations
while IFS= read -r config_file; do
  [ -z "$config_file" ] && continue
  
  # Extract the relative path from config/bf/translations/generated
  relative_path="${config_file#$CONFIG_TRANSLATIONS_PREFIX/}"
  # Expected corresponding file in generated/translations
  expected_translations_file="$TRANSLATIONS_PREFIX/$relative_path"

  # Check if the corresponding file exists in changed translations files
  if ! echo "$CHANGED_TRANSLATIONS" | grep -Fxq "$expected_translations_file"; then
    echo "❌ Error: Modified file in config/bf/translations/generated has no corresponding change in generated/translations/"
    echo "   Config file: $config_file"
    echo "   Expected translations file: $expected_translations_file"
    echo "   If this not intended, please make sure to modify the corresponding file in generated/translations/ as well."
    ERROR_FOUND=1
  fi
done <<< "$CHANGED_CONFIG_TRANSLATIONS"

# Check 4: Each file in generated/translations must have a corresponding file in config/bf/translations/generated
while IFS= read -r translations_file; do
  [ -z "$translations_file" ] && continue
  
  # Extract the relative path from generated/translations
  relative_path="${translations_file#$TRANSLATIONS_PREFIX/}"
  
  # Expected corresponding file in config/bf/translations/generated
  expected_config_file="$CONFIG_TRANSLATIONS_PREFIX/$relative_path"
  
  # Check if the corresponding file exists in changed config files
  if ! echo "$CHANGED_CONFIG_TRANSLATIONS" | grep -Fxq "$expected_config_file"; then
    echo "❌ Error: Modified file in generated/translations has no corresponding change in config/bf/translations/generated/"
    echo "   Translations file: $translations_file"
    echo "   Expected config file: $expected_config_file"
    echo "   If this not intended, please make sure to modify the corresponding file in config/bf/translations/generated/ as well."
    ERROR_FOUND=1
  fi
done <<< "$CHANGED_TRANSLATIONS"

if [ $ERROR_FOUND -eq 1 ]; then
  echo ""
  echo "📋 Changes are out of sync!"
  echo "Files must be kept in sync between:"
  echo "  • apps/bf/web/config/bf/assets/ ↔ apps/bf/web/assets/"
  echo "  • apps/bf/web/config/bf/translations/generated/ ↔ apps/bf/web/generated/translations/"
  echo "Any change to a file in one directory must be mirrored in the other."
  exit 1
fi

exit 0
