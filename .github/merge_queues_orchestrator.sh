#!/bin/bash

# Variables injected from the GH action
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --lastcommit) LAST_COMMIT="$2"; shift ;;
    --currentcommit) CURRENT_COMMIT="$2"; shift ;;
    *) echo "Unknown parameter passed: $1"; exit 1 ;;
  esac
  shift
done

# Create an array with a list of jobs to iterate over. Allow for future additions to the array without requiring changes to the rest of the script.
job_list=("tbd_ci_build" "tbdn_build_in_house_android")

echo "LAST_COMMIT: $LAST_COMMIT"
echo "CURRENT_COMMIT: $CURRENT_COMMIT"

# Read the configuration file

config=$(cat .github/files.json)

# Get the list of files to be ignored when changes were made on them

global_ignore_files=$(echo "$config" | jq -r '.global_ignore_files[] | .regex[]')

# Get the list of changed files

changed_files_list=$(git diff --name-only "$LAST_COMMIT"  "$CURRENT_COMMIT" | sort | uniq | grep -v -E  "$global_ignore_files" | cat)

echo "changed_files_list: $changed_files_list"

# Get the number of files changes on the list

changed_files=$(echo "$changed_files_list" | wc -w)

echo "changed_files: $changed_files"

for job in "${job_list[@]}"; do

  echo "Iterating over : $job"

  # Get the list of folders for the job to check if there are any changes. 
  job_folders=$(echo "$config" | jq -r ".${job}[] | .regex[]")

  # Get the list of folders to ignore for the job to check if there are any changes. 
  job_ignore_folders=$(echo "$config" | jq -r ".${job}[] | .job_ignore_files[]")

  # Get the full list of file changes and check if there are any changes in the job folders 
  job_changes_list=$(echo "$changed_files_list" | grep -E "$job_folders" | grep -v -E "$job_ignore_folders" | cat ) 

  echo "$job changes : $job_changes_list"

  if [ -z "$job_changes_list" ]; then

    echo "No changes in $job files. Skipping the next steps "
    
    if [ "$job" == "tbd_ci_build" ]; then

      web_job_changes="false"
      echo "web_changes=$web_job_changes" >> $GITHUB_OUTPUT

    elif [ "$job" == "tbdn_build_in_house_android" ]; then

      native_job_changes="false"
      echo "native_changes=$native_job_changes" >> $GITHUB_OUTPUT

    fi
    
  else

    echo "Changes in $job files. Running next steps."

    if [ "$job" == "tbd_ci_build" ]; then

      web_job_changes="true"
      echo "web_changes=$web_job_changes" >> $GITHUB_OUTPUT

    elif [ "$job" == "tbdn_build_in_house_android" ]; then

      native_job_changes="true"
      echo "native_changes=$native_job_changes" >> $GITHUB_OUTPUT

    fi
   
  fi

done

