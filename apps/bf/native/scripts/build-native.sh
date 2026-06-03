#!/bin/bash

# Colors for output
BLUE="\033[0;94m"
PURPLE="\033[0;35m"
GREEN="\033[0;32m"
NC="\033[0m"

# General variables
BUILD_DIR="./build/"



##############################################
# Build Folder Setup
##############################################
echo "🚧  Creating build directory..."

if [ ! -d "${BUILD_DIR}" ]; then
  echo "📦  Creating ${GREEN}/build${NC} directory"
  mkdir -p "${BUILD_DIR}"
else
  echo "⚡️  /build directory already created, skipping..."
fi
echo

# This will be used to manage /build folder content and ensure it has the correct brand configurations
