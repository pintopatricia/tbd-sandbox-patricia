#!/bin/bash

bold=$(tput bold);
normal=$(tput sgr0);
yellow_text=$(tput setaf 3)
green_text=$(tput setaf 2)
white_text=$(tput setaf 7)
reset=`tput sgr0`

# regex to catch a semantic version that can include patch
SEM_VERSION_REGEX="[0-9]{1,2}\.[0-9]{1,2}(\.[0-9]{1,2})?";

# Compare semantic versions. Given two semantic versions A and B
# * set COMPARE_VERSION_RESULT 0 if A and B are exactly the same
# * set COMPARE_VERSION_RESULT -1 if A is higher than B
# * set COMPARE_VERSION_RESULT 1 if A id lower than B

ISSUES_FOUND=0;

function compareVersions () {
  local semversion_1=$1
  local semversion_2=$2

  local major_1=$(echo $semversion_1 | cut -d '.' -f 1)
  local minor_1=$(echo $semversion_1 | cut -d '.' -f 2)
  local patch_1=$(echo $semversion_1 | cut -d '.' -f 3)

  local major_2=$(echo $semversion_2 | cut -d '.' -f 1)
  local minor_2=$(echo $semversion_2 | cut -d '.' -f 2)
  local patch_2=$(echo $semversion_2 | cut -d '.' -f 3)

  if [[ $semversion_1 == $semversion_2 ]]; then
    COMPARE_VERSION_RESULT=0;
  fi

  if [[ $major_1 == $major_2 ]]; then
    if [[ $minor_1 == $minor_2 ]]; then
      if [[ $patch_1 -lt $patch_2 ]] || [[ $patch_1 -eq $patch_2 ]]; then
        COMPARE_VERSION_RESULT=1;
      else
        COMPARE_VERSION_RESULT=-1;
      fi
    else
      if [[ $minor_1 -ge $minor_2 ]]; then
        COMPARE_VERSION_RESULT=-1;
      else
        COMPARE_VERSION_RESULT=1;
      fi
    fi
  else
    if [[ $major_1 -gt $major_2 ]]; then
      COMPARE_VERSION_RESULT=-1;
    else
      COMPARE_VERSION_RESULT=1;
    fi
  fi
}

# Given an expected and and current versions, this function checks if the current version is equal or higher than the expected.
# The function takes the following arguments
# * EXPECTED_VERSION - Expected or Minimum version required
# * CURRENT_VERSION - Current Version installed in user's system
# * DEPENDENCY_NAME - Dependency name to show meaningful messages to the user

function isMinimumVersion() {
  EXPECTED_VERSION=$1;
  CURRENT_VERSION=$2;
  DEPENDENCY_NAME=$3;
  PROPOSED_SOLUTION_URL=$4;


  ERROR_MESSAGE="${DEPENDENCY_NAME} Version ${white_text}${CURRENT_VERSION}${reset}. Expected to be at least ${white_text}$EXPECTED_VERSION${reset}";
  ERROR_MESSAGE_SUGGESTION_TO_FIX="💡 Follow the instructions \e]8;;${PROPOSED_SOLUTION_URL}\ahere\e]8;;\a to install the ${DEPENDENCY_NAME}\n"

  compareVersions "$EXPECTED_VERSION" "$CURRENT_VERSION"
  if [ ! $COMPARE_VERSION_RESULT -eq 1 ]; then
    ISSUES_FOUND=1;
  fi
}

# Given an expected and current versions, this function checks if there is a valid match. Optionally the patch can be ignored
# The function takes the following arguments:
# * EXPECTED_VERSION" - Expected or Minimum version required
# * CURRENT_VERSION" - Current Version installed in user's system
# * DEPENDENCY_NAME - Dependency name to show meaningful messages to the user
# * IGNORE_PATCH_VERSION_FLAG - Flag to consider patch version in the comparison
# * IS_MINIMUM_VERSION_FLAG - Flag to consider if expected version can be seen as a minium version

function isValidVersionMatch() {
  EXPECTED_VERSION=$1;
  CURRENT_VERSION=$2;
  DEPENDENCY_NAME=$3;
  IGNORE_PATCH_VERSION_FLAG=$4;
  PROPOSED_SOLUTION_URL=$5;
  IS_MINIMUM_VERSION_FLAG=$6;

  ERROR_MESSAGE="${DEPENDENCY_NAME} Expected version to be: ${white_text}${EXPECTED_VERSION}${reset} and currently it is ${white_text}${CURRENT_VERSION}${reset}";
  ERROR_MESSAGE_SUGGESTION_TO_FIX="💡 Follow the instructions \e]8;;${PROPOSED_SOLUTION_URL}\ahere\e]8;;\a to install the ${DEPENDENCY_NAME}\n"

  LOCAL_ISSUES_FOUND=0;

  if [ -n $IS_MINIMUM_VERSION_FLAG ] && [[ $IS_MINIMUM_VERSION_FLAG -eq 1 ]]; then
    isMinimumVersion "$EXPECTED_VERSION" "$CURRENT_VERSION" $DEPENDENCY_NAME $RESOLUTION_URL;
  elif [ $IGNORE_PATCH_VERSION_FLAG -eq 1 ]; then
      if [[ "$EXPECTED_VERSION" != "$CURRENT_VERSION"* ]]; then
        LOCAL_ISSUES_FOUND=1;
      fi
  else
    if [[ "$EXPECTED_VERSION" != "$CURRENT_VERSION" ]]; then
      LOCAL_ISSUES_FOUND=1;
    fi
  fi

  if [ $LOCAL_ISSUES_FOUND -eq 1 ]; then
    printf "\n${yellow_text}🚨${reset} ${ERROR_MESSAGE}\n";
    printf "${ERROR_MESSAGE_SUGGESTION_TO_FIX}\n";
    ISSUES_FOUND=1;
  else
    printf "${green_text}✔${reset} ${DEPENDENCY_NAME} Version ${white_text}${CURRENT_VERSION}${reset}\n";
  fi
}

CHECKLIST=$(less ./scripts/versioning/checklist-versions.yml)

printf "${bold}ℹ️  Comparing installed dependencies versions against checklist${normal}\n"

EXPECTED_MAC_OS_VERSION=$(echo $CHECKLIST | grep -Eo "mac_os_version: ${SEM_VERSION_REGEX}" | grep -Eo $SEM_VERSION_REGEX);
CURRENT_MAC_OS_VERSION=$(sw_vers -productVersion);
RESOLUTION_URL="https://github.com/Flutter-Global/tbd/wiki/Native-%%E2%%80%%90-Installing-Dependencies#mac-os-to-141-sonoma"
isValidVersionMatch "$EXPECTED_MAC_OS_VERSION" "$CURRENT_MAC_OS_VERSION" "Mac OS" 1 $RESOLUTION_URL 1;

EXPECTED_NODE_VERSION=$(echo $CHECKLIST | grep -Eo "node_version: v${SEM_VERSION_REGEX}" | grep -Eo v${SEM_VERSION_REGEX});
CURRENT_NODE_VERSION=$(node -v | grep -Eo "v[0-9]{1,2}\.[0-9]{1,2}");
RESOLUTION_URL="https://github.com/Flutter-Global/tbd/wiki/Native-%%E2%%80%%90-Installing-Dependencies#node-v16130"
isValidVersionMatch "$EXPECTED_NODE_VERSION" "$CURRENT_NODE_VERSION" "Node" 1 $RESOLUTION_URL;

EXPECTED_YARN_VERSION=$(echo $CHECKLIST | grep -Eo "yarn_version: ${SEM_VERSION_REGEX}" | grep -Eo $SEM_VERSION_REGEX);
CURRENT_YARN_VERSION=$(yarn -v)
RESOLUTION_URL="https://github.com/Flutter-Global/tbd/wiki/Native-%%E2%%80%%90-Installing-Dependencies#yarn-12210"
isValidVersionMatch "$EXPECTED_YARN_VERSION" "$CURRENT_YARN_VERSION" "Yarn" 1 $RESOLUTION_URL 1;

EXPECTED_RUBY_VERSION=$(echo $CHECKLIST | grep -Eo "ruby_version: ${SEM_VERSION_REGEX}" | grep -Eo $SEM_VERSION_REGEX);
CURRENT_RUBY_VERSION=$(ruby -v | cut -d " " -f 2 | grep -Eo "[0-9]{1,2}\.[0-9]{1,2}");
RESOLUTION_URL="https://github.com/Flutter-Global/tbd/wiki/Native-%%E2%%80%%90-Installing-Dependencies#ruby-322"
isValidVersionMatch "$EXPECTED_RUBY_VERSION" "$CURRENT_RUBY_VERSION" "Ruby" 1 $RESOLUTION_URL;

EXPECTED_XCODE_VERSION=$(echo $CHECKLIST | grep -Eo "xcode_version: ${SEM_VERSION_REGEX}" | grep -Eo $SEM_VERSION_REGEX);
CURRENT_XCODE_VERSION=$(/usr/bin/xcodebuild -version |  head -n1 | grep -Eo $SEM_VERSION_REGEX);
RESOLUTION_URL="https://github.com/Flutter-Global/tbd/wiki/Native-%%E2%%80%%90-Installing-Dependencies#xcode-15"
isValidVersionMatch "$EXPECTED_XCODE_VERSION" "$CURRENT_XCODE_VERSION" "Xcode" 1 $RESOLUTION_URL;

EXPECTED_COCOAPODS_VERSION=$(echo $CHECKLIST | grep -Eo "cocoapods_version: ${SEM_VERSION_REGEX}" | grep -Eo $SEM_VERSION_REGEX);
CURRENT_COCOAPODS_VERSION=$(pod --version);
RESOLUTION_URL="https://github.com/Flutter-Global/tbd/wiki/Native-%%E2%%80%%90-Installing-Dependencies#cocoapods-1152"
isValidVersionMatch "$EXPECTED_COCOAPODS_VERSION" "$CURRENT_COCOAPODS_VERSION" "CocoaPods" 1 $RESOLUTION_URL;

EXPECTED_JDK_VERSION=$(echo $CHECKLIST | grep -Eo "jdk_version: ${SEM_VERSION_REGEX}" | grep -Eo $SEM_VERSION_REGEX);
CURRENT_JDK_VERSION=$(java -version 2>&1 | head -n 1 | awk -F '"' '{print $2}');
RESOLUTION_URL="https://github.com/Flutter-Global/tbd/wiki/Native-%%E2%%80%%90-Installing-Dependencies#java-jdk-11011"
isValidVersionMatch "$EXPECTED_JDK_VERSION" "$CURRENT_JDK_VERSION" "Java JDK" 0 $RESOLUTION_URL 1;

IOS_14_DEVICE_COUNT=$(xcrun xctrace list devices | grep -o "iPhone 14 (17\.0\.\<[0-9]*\>" -c);

if [[ $IOS_14_DEVICE_COUNT -ge 1 ]]; then
  printf "${green_text}✔${reset} You have at least one iphone 14 device installed correctly";
else
  printf "\n${reset} iphone 14 devices not found";
  PROPOSED_SOLUTION_URL="https://github.com/Flutter-Global/tbd/wiki/Native-%%E2%%80%%90-Installing-Dependencies#ios-170-simulator"
  ERROR_MESSAGE_SUGGESTION_TO_FIX="💡 Follow the instructions \e]8;;${PROPOSED_SOLUTION_URL}\ahere\e]8;;\a to install the ${DEPENDENCY_NAME}"
  printf "${ERROR_MESSAGE_SUGGESTION_TO_FIX}\n"
  ISSUES_FOUND=1
fi

# check if were there found any issues with the versions installed localy. If
# issues were found it will loop through the ISSUES_FOUND array and print the
# messages added.

if [ $ISSUES_FOUND -eq 0 ]; then
    printf "\n\n${white_text}Cheers 🍻 All the dependencies are in place 🎉${reset}\n"
else
    printf "\n\n💥 ${yellow_text}Oops, something isn't right!${reset}\n"
fi

