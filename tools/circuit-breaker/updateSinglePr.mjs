const OWNER = "Flutter-Global";
const REPO = "tbd";
const UNBLOCK_WORKFLOW_ID = 124943694;
const BLOCK_WORKFLOW_ID = 124943696;
const WORKFLOW_CONTEXT = "tbd-circuit-breaker";

export default async function updateSinglePr(github, prNumber, forceUnblock) {
  // unblocks PR by setting the status to success
  const unblockPR = async (lastCommit, description) => {
    console.log("Unblocking PR", `PR_ID: ${prNumber}`, `COMMIT: ${lastCommit}`);
    await github.rest.repos.createCommitStatus({
      owner: OWNER,
      repo: REPO,
      sha: lastCommit,
      state: "success",
      description,
      context: WORKFLOW_CONTEXT,
    });
  };

  // validate parameters and throw an error if missing
  if (forceUnblock === undefined || prNumber === undefined) {
    throw new Error("Missing required parameters: 'forceUnblock' and 'prNumber'.");
  }

  const commit = await github.rest.pulls.listCommits({
    owner: OWNER,
    repo: REPO,
    pull_number: prNumber,
    per_page: 100,
  });
  // gets the last commit hash
  const lastCommit = commit.data[commit.data.length - 1].sha;

  // if the action is forced to unblock, unblock the PR
  if (forceUnblock === "true") {
    return await unblockPR(lastCommit, "Hotfix not blocked");
  }
  const blockRuns = await github.rest.actions.listWorkflowRuns({
    owner: OWNER,
    repo: REPO,
    workflow_id: UNBLOCK_WORKFLOW_ID,
  });

  const unblockRuns = await github.rest.actions.listWorkflowRuns({
    owner: OWNER,
    repo: REPO,
    workflow_id: BLOCK_WORKFLOW_ID,
  });

  const allWorkflowRuns = [...blockRuns.data.workflow_runs, ...unblockRuns.data.workflow_runs];
  const lastSuccessfulRun = allWorkflowRuns
    .sort((a, b) => new Date(b.run_started_at).getTime() - new Date(a.run_started_at).getTime())
    .find((run) => run.conclusion === "success");

  // if the last successful run was unblock, unblock the PR else block
  if (!lastSuccessfulRun || lastSuccessfulRun.workflow_id === UNBLOCK_WORKFLOW_ID) {
    await unblockPR(lastCommit, "Merges not blocked");
  } else if (lastSuccessfulRun.workflow_id === BLOCK_WORKFLOW_ID) {
    console.log("Blocking PR", `PR_ID: ${prNumber}`, `COMMIT: ${lastCommit}`);
    await github.rest.repos.createCommitStatus({
      owner: OWNER,
      repo: REPO,
      sha: lastCommit,
      state: "pending",
      description: "All merges are currently blocked please see #tbd-engineers",
      target_url: "https://flutter.enterprise.slack.com/archives/C07APFV30ES",
      context: WORKFLOW_CONTEXT,
    });
  }
}
