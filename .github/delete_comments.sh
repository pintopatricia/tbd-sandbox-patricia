#!/bin/bash

# Curl command to get the list of pull requests

pr_list=$(curl -s -H "Authorization: Bearer ${GITHUB_TOKEN}" \
              -H "Accept: application/vnd.github.v3+json" \
              "https://api.github.com/repos/Flutter-Global/tbd/pulls?per_page=100")

# Extract the number of each pull request using jq
            
pr_numbers=($(echo "$pr_list" | jq -r '.[].number'))

for numbers in "${pr_numbers[@]}"; do

    pr_comments=$(curl -s -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github.v3+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    https://api.github.com/repos/Flutter-Global/tbd/issues/${numbers}/comments)

    # Extract id comments of each pull request using jq 
    pr_comments_id=($(echo "$pr_comments" | jq -r '.[].id'))

    for comment_id in "${pr_comments_id[@]}"; do

        # Extract all the comments from the pull request
        pr_comments_id=$(curl -L -H "Authorization: Bearer ${GITHUB_TOKEN}" \
        -H "Accept: application/vnd.github.v3+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        https://api.github.com/repos/Flutter-Global/tbd/issues/comments/${comment_id})


        # Extract the body comment of the comment using jq and deletes it if start with /
        body_comment=($(echo "$pr_comments_id" | jq -r '.body'))

        if [[ $body_comment == /* ]]; then 
            echo "This command : $body_comment will be deleted:"
            curl -L \
            -X DELETE \
            -H "Accept: application/vnd.github+json" \
            -H "Authorization: Bearer ${GITHUB_TOKEN}" \
            -H "X-GitHub-Api-Version: 2022-11-28" \
            https://api.github.com/repos/Flutter-Global/tbd/issues/comments/${comment_id}
        else 
            echo "This command : $body_comment will not be deleted"
        fi
    done
done
