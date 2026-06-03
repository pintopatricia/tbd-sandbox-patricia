gh auth login --with-token $GITHUB_TOKEN

REPO="Flutter-Global/tbd"
TARGET_REPO=${TARGET_REPO:-Flutter-Global/tbd}
TARGET_BRANCH=${TARGET_BRANCH:-$BRANCH_NAME}
REPO_URL="https://github.com/$TARGET_REPO"

# Set the new PR body message
BASELINES_PR_BODY="## New baselines
Automatically generated baselines from the branch: $BRANCH_NAME.
Please follow the steps below:
1. **Review the changes** in this PR
> - Changes in this PR may include added, updated, and/or removed baselines.
> - If necessary, adjust the code in your original branch. The present PR will be updated automatically by the CI.
> - If you notice unrelated commits, the CI may still be running. Please wait a few minutes and check again.
2. **Merge this PR** once the baseline updates match the **expected changes**.
> - This PR already points to your development branch, so no additional changes are required.
> - No approval is needed for this PR!
3. **Enjoy your updated baselines!** 🎉"

# Try to create a new pull request and capture the output
PR_CREATE_OUTPUT=$(gh pr create --title "New baselines from: $BRANCH_NAME" --body "$BASELINES_PR_BODY" --base $TARGET_BRANCH --head $BASELINES_BRANCH --repo "$TARGET_REPO" 2>&1)

# Check if the error message contains the text indicating a PR already exists
if echo "$PR_CREATE_OUTPUT" | grep -q "pull request for branch"; then
  # Extract the pull request path from the error message
  PR_URL=$(echo "$PR_CREATE_OUTPUT" | grep -o "/pull/[0-9]*")

  # Construct the full URL for the existing PR
  FULL_PR_URL="${REPO_URL}${PR_URL}"

  # Log the full URL of the existing PR
  echo "A pull request already exists: $FULL_PR_URL"
  PR_MESSAGE="## 🎉 Pull Request Updated!
A pull request was updated for the baselines from $BRANCH_NAME. Please review the changes on: $FULL_PR_URL!"
else
  # If no error, the PR was successfully created, extract the new PR URL
  NEW_PR_URL=$(echo "$PR_CREATE_OUTPUT" | grep -o 'https://github\.com[^ ]*')
  # Log the full URL of the newly created PR
  if [ -n "$NEW_PR_URL" ]; then
    echo "New pull request created: $NEW_PR_URL"
    PR_MESSAGE="## 🎉 New Pull Request Created!
Here are the details:
  - **Title:** New baselines from: $BRANCH_NAME
  - **Description:** Your new baselines were generated on $BASELINES_BRANCH
Please review the changes on: $NEW_PR_URL!"
  else
    echo "PR creation output did not contain a URL. Output: $PR_CREATE_OUTPUT"
    PR_MESSAGE="## 🚨 Error Creating Pull Request
There was an error creating the pull request. Please check the logs for more details."
  fi
fi

gh pr comment $BASE_PR --body "$PR_MESSAGE" --repo $REPO