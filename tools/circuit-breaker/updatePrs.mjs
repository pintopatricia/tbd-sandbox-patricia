export default async function updatePrs(github, action) {
  const owner = "Flutter-Global";
  const repo = "tbd";
  const workflow_context = "tbd-circuit-breaker";

  const prs = await github.paginate("GET /repos/{owner}/{repo}/pulls", {
    owner,
    repo,
    state: "open",
    per_page: 100,
  });

  for (const pr of prs) {
    const commit = await github.rest.pulls.listCommits({
      owner,
      repo,
      pull_number: pr.number,
    });

    const lastCommit = commit.data[commit.data.length - 1].sha;
    if (action === "block") {
      console.log("Blocking PR", `PR_ID: ${pr.number}`, `COMMIT: ${lastCommit}`);
      await github.rest.repos.createCommitStatus({
        owner,
        repo,
        sha: lastCommit,
        state: "pending",
        description: "All merges are currently blocked please see #tbd-engineers",
        target_url: "https://flutter.enterprise.slack.com/archives/C07APFV30ES",
        context: workflow_context,
      });
    } else {
      console.log("Unblocking PR", `PR_ID: ${pr.number}`, `COMMIT: ${lastCommit}`);
      await github.rest.repos.createCommitStatus({
        owner,
        repo,
        sha: lastCommit,
        state: "success",
        description: "Merges not blocked",
        context: workflow_context,
      });
    }
  }
}
