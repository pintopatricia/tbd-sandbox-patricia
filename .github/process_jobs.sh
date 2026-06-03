#!/bin/bash

# Array of parameterized jobs in TBD
parameterized_jobs=("tbd_ci_build" "tbdsbg_ci_build" "tbdps_ci_build" "tbdpp_ci_build" "tbdui_ci_build" "tbd_http_webserver_ci_build" "tbdn_ci_build" "tbdnsbg_ci_build" "tbdn_build_in_house_android" "tbdnsbg_build_in_house_android" "tbdnpp_ci_build" "tbdexc_ci_build" "tbdnexc_ci_build")
github_ios_jobs=("tbdn_build_in_house_ios" "tbdnsbg_build_in_house_ios")
github_android_jobs=("tbdn_build_in_house_android" "tbdnsbg_build_in_house_android")

# Variables injected from the GH action
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --lastcommit) LAST_COMMIT="$2"; shift ;;
    --currentcommit) CURRENT_COMMIT="$2"; shift ;;
    --jenkinstbduser) JENKINS_TBD_USER="$2"; shift ;;
    --jenkinsurl) JENKINS_URL="$2"; shift ;;
    --jenkinstbdusertoken) JENKINS_TBD_USER_TOKEN="$2"; shift;;
    *) echo "Unknown parameter passed: $1"; exit 1 ;;
  esac
  shift
done

echo "LAST_COMMIT: $LAST_COMMIT"
echo "CURRENT_COMMIT: $CURRENT_COMMIT"

# Read the configuration file

config=$(cat .github/files.json)

# Get object names from top to bottom

key_names=$(echo "$config" | jq -r 'keys_unsorted | .[]')

# Get the list of files to be ignored when changes were made on them

global_ignore_files=$(echo "$config" | jq -r '.global_ignore_files[] | .regex[]')

# Get the list of changed files

changed_files_list=$(git diff --name-only $LAST_COMMIT  $CURRENT_COMMIT | sort | uniq | grep -v -E  "$global_ignore_files" | cat)

echo "changed_files_list: $changed_files_list"

# Get the number of files changes on the list.

changed_files=$(echo "$changed_files_list" | wc -w)

echo "changed_files: $changed_files"

if [ -z "$changed_files_list" ]; then

    echo "No changes in relevant files. Skipping jobs."

else

    for key_name in $key_names; do

        echo "key_name : $key_name"

        # This list of files are not needed to trigger jenkins jobs, so it is skipping to the next object name

        if [[ "$key_name" == "global_ignore_files" ]]; then
             continue
        fi
        # Get the jobs, and files to check if changes were made on this job.

        jobs=$(echo "$config" | jq -r --arg obj "$key_name" '
            .[$obj][] | .job[] + ":" + .regex[]')

        # Verify if the job has files to be ignored

        job_ignore_files=$(echo "$config" | jq -r --arg obj "$key_name" '.[$obj][] | (if has("job_ignore_files") then .job_ignore_files[] else "" end)')

        # Iterate over the jobs in the configuration file

        while IFS= read -r line; do
            job_name=$(echo "$line" | cut -d':' -f1)
            regex=$(echo "$line" | cut -d':' -f2)

            if [ -z "$job_ignore_files" ]; then
                # Update the changed file list with new name to the next step, and also allow to keep the original changed files for the next object name.
                new_changed_files_list=$changed_files_list
            else
                # Update the changed file list, excluding files from the list of job ignore files
                new_changed_files_list=$(echo "$changed_files_list" | grep -v -E "$job_ignore_files")
            fi

            if [ -z "$new_changed_files_list" ]; then
                echo "No changes in relevant files. Skipping $job_name."
                break
            fi

            regex_matched=false

            # Check if any of the changed files match the regex pattern for the job
            for file in $new_changed_files_list; do

                if  echo "$file" | grep -qE "$regex" ; then

                    echo "Changes detected in $file.Triggering $job_name job."
                    if [[ " ${github_ios_jobs[*]} " == *" $job_name "* ]]; then
                        echo "native_ios_changes=true" >> $GITHUB_OUTPUT
                    fi
                    if [[ " ${github_android_jobs[*]} " == *" $job_name "* ]]; then
                        echo "native_android_changes=true" >> $GITHUB_OUTPUT
                    fi
                    # Trigger the Jenkins job using curl
                    if [[ " ${parameterized_jobs[*]} " == *" $job_name "* ]]; then
                        curl -X POST -Lu $JENKINS_TBD_USER:$JENKINS_TBD_USER_TOKEN "$JENKINS_URL/job/$job_name/buildWithParameters"
                    else
                        curl -X POST -Lu $JENKINS_TBD_USER:$JENKINS_TBD_USER_TOKEN "$JENKINS_URL/job/$job_name/build"
                    fi
                    sleep 3
                    regex_matched=true
                    break
                else
                    echo "No changes detected on this job file"
                fi

            done <<< "$changed_files_list" # go to the while if loop

            if [ "$regex_matched" = true ]; then
                break
            fi
        done <<< "$jobs" # go to the object name start loop
    done
fi
