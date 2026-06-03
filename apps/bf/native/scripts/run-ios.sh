#!/bin/bash

# Colors for output
BLUE="\033[0;94m"
PURPLE="\033[0;35m"
GREEN="\033[0;32m"
RED="\033[0;91m"
NC="\033[0m"

# Override with environment variables from .env and .env.local files
source .env
[ -f .env.local ] && source .env.local



##############################################
# Build Folder Setup
##############################################
echo
echo "You're about to setup everything to build iOS..."
echo

# Starts build-native script to setup build folder with correct brand configurations
sh scripts//build-native.sh



##############################################
# Release Mode Setup
##############################################
echo "📦  Setting release mode ${GREEN}${MODE}${NC}"
if [ -z "${MODE}" ]; then
  echo
  echo "💥  ${RED}ERROR${NC}: MODE variable was not set."
  echo "ℹ️  Please provide a MODE environment variable with a valid value, such as ${GREEN}internal${NC} (e.g.: MODE=internal yarn ios)."

  exit 1
fi

# Sets the right release mode for the build
yarn releaseMode ${MODE}



##############################################
# Environment Setup
##############################################
echo "📦  Setting environment ${GREEN}${ENV}${NC}"
if [ -z "${ENV}" ]; then
  echo
  echo "💥  ${RED}ERROR${NC}: ENV variable was not set."
  echo "ℹ️  Please provide a ENV environment variable with a valid value, such as ${GREEN}qa${NC} (e.g: ENV=qa yarn ios)."

  exit 1
fi

# Sets the right environment for the build
yarn environment ${ENV}



##############################################
# Information About the Build
##############################################
echo
echo "You're about to build an iOS app with the following configuration..."
echo
echo "🚀  ${BLUE}${APP_BRAND}${NC}(${MODE}) ▶▶▶ ${PURPLE}${ENV}${NC}"
echo "   Variant: ${GREEN}${VARIANT}${NC}"
echo



##############################################
# Build iOS App
##############################################
react-native run-ios \
  --mode="${VARIANT}"
