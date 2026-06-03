export default async function getLatestWorkflowRunId(github) {
  const owner = "Flutter-Global";
  const repo = "tbd";

  const blockRuns = await github.rest.actions.listWorkflowRuns({
    owner,
    repo,
    workflow_id: 124943696,
  });

  const unblockRuns = await github.rest.actions.listWorkflowRuns({
    owner,
    repo,
    workflow_id: 124943694,
  });

  const allWorkflowRuns = [...blockRuns.data.workflow_runs, ...unblockRuns.data.workflow_runs];
  const lastSuccessfulRun = allWorkflowRuns
    .sort((a, b) => new Date(b.run_started_at).getTime() - new Date(a.run_started_at).getTime())
    .find((run) => run.conclusion === "success");

  return lastSuccessfulRun ? lastSuccessfulRun.id : null;
}
