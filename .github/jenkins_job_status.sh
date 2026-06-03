#!/bin/bash

set -e

# Variables injected from the GH action
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --jenkinstbduser) JENKINS_TBD_USER="$2"; shift ;;
    --jenkinsurl) JENKINS_URL="$2"; shift ;;
    --jenkinsjob) JENKINS_JOB="$2"; shift ;;
    --jenkinstbdusertoken) JENKINS_TBD_USER_TOKEN="$2"; shift;;
    --githubsha) GITHUB_SHA="$2"; shift;;
    --branch) BRANCH="$2"; shift;;
    --) shift; break ;;
    *) echo "Unknown parameter passed: $1"; exit 1 ;;
  esac
  shift
done

echo "Triggering job"

# Capture all remaining parameters after '--' as Jenkins parameters, used this approach since web and native have different parameters.
JENKINS_PARAMS="$*"

JENKINS_CRUMB=$(curl -q -u $JENKINS_TBD_USER:$JENKINS_TBD_USER_TOKEN "$JENKINS_URL/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,\":\",//crumb)")

response=$(curl -u $JENKINS_TBD_USER:$JENKINS_TBD_USER_TOKEN -H $JENKINS_CRUMB -i -X POST "$JENKINS_URL/job/$JENKINS_JOB/buildWithParameters?githubsha=$GITHUB_SHA&branch=$BRANCH&$JENKINS_PARAMS")

echo "Jenkins response: $response"

sleep 30

location=$(echo "$response" | grep -Fi Location | sed 's/Location: //')

echo "location: $location"

job_number=$(echo "$location" | grep -o '[0-9]\+')

echo "job number: $job_number"

echo "job_number=$job_number" >> $GITHUB_OUTPUT

new_url="$JENKINS_URL/queue/item/$job_number/api/json?pretty=true"

build_output=$(curl -u $JENKINS_TBD_USER:$JENKINS_TBD_USER_TOKEN -H $JENKINS_CRUMB "$JENKINS_URL/queue/item/$job_number/api/json?pretty=true")
pending_build=$(echo $build_output | jq '.buildable == true and .blocked == false and .stuck == false and .pending == false')
build_number=""

if [ "$pending_build" ]; then

  why=$(echo $build_output | jq '.why')
  echo "pending job, waiting for $why";

  while true; do
    output=$(curl -u $JENKINS_TBD_USER:$JENKINS_TBD_USER_TOKEN -H $JENKINS_CRUMB "$JENKINS_URL/queue/item/$job_number/api/json?pretty=true")
    pending=$(echo $output | jq '.buildable == true and .blocked == false and .stuck == false and .pending == false')
    if [ "$pending" = 'false' ]; then
          echo 'job has started'
          build_number=$(echo $output | jq -r '.executable.number')
          break
    else
      why=$(echo $output | jq '.why')
      echo "Job still pending due to $why. Sleeping 30s and trying again.";
    fi
    sleep 30
  done;
else
  build_number=$(echo $build_output | jq -r '.executable.number')
fi

echo "build number: $build_number"

echo "build_number=$build_number" >> $GITHUB_OUTPUT

JOB_INFO="$JENKINS_URL/job/$JENKINS_JOB/$build_number/api/json"

echo "job info: $JOB_INFO"

sleep 10

while true; do
  BUILD_URL=$(curl -u $JENKINS_TBD_USER:$JENKINS_TBD_USER_TOKEN "$JOB_INFO" | jq -r '.result' )

    if [ "$BUILD_URL" == FAILURE ]; then
        echo "The Job has failed , please access 'http://jenkins-prd.prd.betfair/job/$JENKINS_JOB/$build_number' to check the reason why job has failed"
        exit 1

    elif [ "$BUILD_URL" == SUCCESS ] || [ "$BUILD_URL" == UNSTABLE ]; then
        echo "Job ran successfully"
        break

    else
        echo "Job is not complete , you can check progress : 'http://jenkins-prd.prd.betfair/job/$JENKINS_JOB/$build_number'"
        sleep 120

    fi

done
