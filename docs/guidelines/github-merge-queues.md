# GitHub Merge Queues

TBD monorepo holds all components that comprise Betfair Rebuild Channels, which makes it one of the largest repositories in the organization. Along with its size, comes a high number of contributors, which results in high volumes of contributions everyday, making the repo and all the CI/CD infrastructure very busy.

This has taken us to a sort of "queue management", where people try to keep this contribution process as civilized as possible, by organizing "queues" for merging their Pull Requests. This requires a very active and tight coordination as people need to keep communicating what's the current status of the queue and CD pipelines.

[GitHub Merge Queues] try to solve this sort of issues, for larger and busier repositories. From a conceptual standpoint, [GitHub Merge Queues] are very similar to what currently happens in TBD, but in an automated and optimized manner. It automates pull request merges into a busy branch and ensures this branch is never broken by incompatible changes. With this new tool, authors are not required to update their pull request branch and wait for status checks to finish. Instead, they can just add their PR to the “merge group”, and if all checks are met, the PR will automatically be merged along with other in the group in bulk.

However, even with this tool, there are some considerations to be made and some guidelines that need to be taken into account in order to keep the contribution model as respectful, organized and smooth as possible.

## Guidelines

#### ➡️ Guideline: Monitor merge process

When adding a PR to a Queue, and all status checks are met, the PR becomes part of the Merge Group that will be merged either when:

- The maximum number of Pull Requests in the Merge Group is reached
- The maximum "Queue" wait time is reached.

Only when one of these two conditions is met, the PRs are merged into `master`. Authors joining the queue must make sure they will be available to follow the merge/deployment process and guarantee the pipeline's stability.

Pipeline status can be checked using the [TBD dashboard].

#### ➡️ Guideline: Accountability

People should understand that with this mechanism, several PRs will be merged at once. This increases the chance of having a red CD pipeline and makes automated validations even more important. For this reason, people should seek to run regression and visual tests in their PRs as much as possible.

If the pipeline breaks, everyone in the merge group should take action, collectively analysing what went wrong and which actions should be taken.

Pipeline status can be checked using the [TBD dashboard].

#### ➡️ Guideline: Keep order

All our CD pipelines are kept in our on-premises infrastructure, separated from the GitHub ecosystem. This makes GitHub unaware of the CD pipeline's progress and status and doesn't prevent contributors from merging new code into master, even if the latest revision is broken at some stage.

As it used to happen before introducing [GitHub Merge Queues], where people were careful to merge PRs only when the CD pipelines were in a healthy status, it is important for PR authors to only create Merge Queues when there are no deployments ongoing and CD pipelines are green.  
Therefore, PRs should not be marked as "ready to be merged" if there's still a build ongoing in Jenkins or Go pipelines or there is any broken pipelines.

Pipeline status can be checked using the [TBD dashboard].

#### ➡️ Guideline: Communicate deployments

When a Merge Group is merged and the CD pipeline finishes (i.e. deployment is successfully made to QA), authors of the deployed Merge Group should update the status of the merge queue in [#tbd_git](https://flutter.enterprise.slack.com/archives/CJJ3Y64J3), the designated slack channel for merge related updates.

This will make it easier for people to understand the CD pipeline status and if is ok to mark their PRs as "ready to be merged" and initiate a new Merge Queue.

[GitHub Merge Queues]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue
[TBD dashboard]: https://tbd-dashboard.sct.dev.betfair/
