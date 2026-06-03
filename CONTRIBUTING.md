[![Quality Gate Status](https://sonarq.prd.internal/api/project_badges/measure?project=tla-tbd&metric=alert_status&token=581ab53bff7d8869da93b441c2fc42e6047f3b54)](https://sonarq.prd.internal/dashboard?id=tla-tbd)

# Contribution guide

You consider contributing to Betfair Rebuild - thank you! Please consider these guidelines that you should follow.

## Branching

Every development must be done in a dedicated branch and merged into master via [Merge Request](#merge-requests).

## Maintaining a linear and meaningful git history

Maintaining a clean and readable history is something really important as it brings us several advantages, namely:

- Meaningful commit messages
- Linear git history (rebase preferred over recursive merge)
- Atomic commits
- Commits have a unique responsibility (a new feature, a fix, a setup change...). This improves code review process.
- Ease on reverting changes
- Better and richer changelog entries

## Good practices for commit messages

- Keep a clear, meaningful with single purpose commit:
  - Avoid mixing whitespace changes with functional changes
    - the whitespace changes will obscure the important functional changes, making it harder for a reviewer to correctly determine whether the change is correct. _Solution_: create 2 commits, one with the whitespace changes, one with the functional changes.
- Avoid mixing two unrelated functional changes.
- Avoid sending large new features in a single giant commit. Benefits of micro commits:

  - **Tell a story.** A well written series of micro commits tell the reviewers the whole story of your code changes, step by step.
  - **Discipline.** Writing good patches of code require quite a bit of practice. It's a good exercise in terms of splitting a complex solution into a well defined sequence of code changes.
  - **Better code reviews.** Micro commits are much easier to review because they do only one thing at a time.
  - **Bisect and cherry pick.** Micro commits make it much easier to spot what caused a regression and are very easy to cherry-pick.

  Note: After the review is done, the commits should be squashed. It is not a rule to have have just one commit: they can be squashed into meaningful squashed commits.

## Commit messages convention

In order to have a consistent git history every commit must follow a specific template:

```
<type>(<package>?): <subject>
<BLANK LINE>
[optional body]
<BLANK LINE>
[optional footer]
```

#### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation
- **docs**: Documentation only changes
- **experiment**: A Loop experiment implementation
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **revert**: A commit that reverts a previous one
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

NOTE: There are some tools that can help with this `types` like [commitizen](https://github.com/commitizen/cz-cli).

#### Package

The related **package**.

- For **packages**, you should use the package name. Example: `feat(tbd-shared): ...`, `fix(client): ...`
- For **no related issues, user stories or defects** you should leave it blank. Example: `feat: ...`

#### Subject

The subject contains a succinct description of the change:

- lowercase, short (50 chars or less) summary
- write your commit message in the imperative (just as in the **subject**)
- no dot (.) at the end

#### Body

The body should include the motivation for the change and contrast this with previous behavior. If necessary, it can detail specific commits and/or the logic behind the implementation that can be sometimes more complex (functionalities and edge cases).

- write your commit message in the imperative: "Fix bug" and not "Fixed bug" or "Fixes bug"
- wrap the body at 72 characters
- explain what and why

#### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference Github issues that this commit **Closes** and information regarding the User Story, Defect:

```
Closes #343
Closes US345123
Closes DE345123
```

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

## Merge Requests

### Planning

During sprint planning bare in mind that:

- Merge Requests will take time and need to be taken into account when
  estimating the user stories
- other teams will have merge requests that need to be reviewed

Make sure you contribute to making this process more agile by reviewing open
merge request before pushing another user story to your sprint.

### Development

Even if it is a small change, you should create a new Merge Request (MR) so the
change is recorded and everyone is on the same page. Since the tests will run
over that branch, it will ease the development process and will prevent any
red builds.

Write useful titles and descriptions. Make it visual. To help with this there's
a [MR template](https://github.com/Flutter-Global/tbd/blob/master/.github/PULL_REQUEST_TEMPLATE.md)
for new features that you should use when creating the MR.

### Validating your MR

#### Automated Validations

There are a set of validations that automatically run on every Merge Request to ensure your changes follow some standards such as code style, unit tests and our bundle size thresholds. These validations (`worktree:root:typecheck` npm script) occur once you open your MR and every time you push changes to it.

Additionally, developers can run both visual and regression tests on their Merge Requests. These tests run when deploying to QA through `master` branch, but in order to anticipate any potential breaking tests on `master` you can run these simply by placing comments to your MR. The supported comments are:

- "_/run-web-all-tests_" - this will run all **regression** tests with your latest changes
- "_/run-web-regression-tests_" - this will run all **regression** tests with your latest changes
- "_/run-web-e2e-tests_" - this will run all **e2e** tests with your latest changes
- "_/run-web-visual-tests_" - this will run all **visual** tests with your latest changes
- "_/storybook-tests_" - this will run all **storybook** tests with your latest changes
- "_/run-core-tests_" - this will run all **core** tests with your latest changes
- "_/run-http-webserver-tests_" - this will run **web server** regression tests with your latest changes
- "_/build-ios-app_" - this will build an iOS app with your changes
- "_/run-ios-regression-tests_" - this will run **iOS** regression tests against an app built with the previous command
- "_/run-ios-visual-tests_" - this will run **iOS** visual tests against an app built with the previous command
- "_/run-ios-e2e-tests_" - this will run **iOS** e2e tests against an app built with the previous command
- "_/build-android-app_" - this will build an Android app with your changes
- "_/run-android-regression-tests_" - this will run **Android** regression tests against an app built with the previous command
- "_/run-android-visual-tests_" - this will run **Android** visual tests against an app built with the previous command

To check the output of these tests, check the console ouput of [tbd_ci_build_test_grid](https://github.com/Flutter-Global/tbd/actions/workflows/web-tests.yml) GH Actions Job.

#### Manual Validations

Although there are plenty of checks to assure code quality, some [Guidelines](#guidelines) are hard to validate in an automated way.
Please double check that your change is aligned with the guidelines around [State Management](docs/guidelines/application-state-management.md).

### Submitter obligations

- Be nice and respect everyone's comments
- You should answer all you MR comments
- Notify the reviewers every time the MR is ready to be reviewed again
- Resolving all discussions, except when agreed otherwise with the member
  commenting the MR
- Submit a screenshot and a video of your change in order to make it easier for the reviewer to get acquainted with the new feature.
  - For a visual change, make sure the video has the React Profiler switched on, so that component re-renders can be observed.
- If the discussion is getting too extensive or hard to understand through comments, have face to face discussions

### Reviewer obligations

- Be nice and respect everyone's work
- Add :eyes: when starting the review, in order to people be aware that review is happening and by whom
- Always give thumbs (up or down) after your review
- Give :thumbsup: when
  - the branch is ready to go to master branch
  - there are small/straightforward changes that need to be made before the
    merge
- Give :thumbsdown: when
  - there are significant changes that need to be made (that
    will require a second review) and _I personally want to take a look_
  - there are important discussions that need to be made before accepting
    the MR

### Rules for merging

- **Must** have two :thumbsup: to be merged into master
  - **Should** have :thumbsup: from different teams
- **Must** not have any :thumbsdown:
- **Must** have all discussions resolved before merging
- **Must** have a green jenkins pipeline (unit tests and linting rules pass)
- **Must** check on the [TBD dashboard](https://tbd-dashboard.sct.dev.betfair/) that there is a green pipeline for the previous build (for Native check the Native pipeline, for Web check the Web pipeline - including regression, e2e and visual tests, if applicable - and the publish step)
  - My changes include a `map-to-props` file - I need to wait until both pipelines are green.
  - I changed a `.native` file - I can merge if the Native pipeline is green, even if the Web pipeline is not.
  - I changed a `.css` file - I can merge if the Web pipeline is green, even if the Native pipeline is not.
- **Must** check in #tbd-engineers-hub channel to make sure there is no issue with the pipeline
- **Must** have commits squashed into meaningful commits
- **Should** remove the source branch when the merge is accepted
- **Should** have branch ready for a fast-forward merge
- **Should** have QA check/review
- **Should** run /regression-and-visual-tests before merging. This step is to help devs testing their changes before merging, preventing a huge amount of red pipelines. Please bear in mind that this job has a high number of false negatives so having this job's pipeline green is not a requirement. However, devs should take a look at the tests failed and understand what was the cause
- **Should** give priority to merge older Merge Requests

In addition to these rules for merging your PR, authors should be aware that with GitHub Merge Queues in place, some additional guidelines should be taken into account. Please check [GitHub Merge Queues guidelines](docs/guidelines/github-merge-queues.md) for further details.

### After merging

- Keep an eye on the pipeline.
- If it fails, let people on tbd-git channel know that you're trying to fix it and update the channel with relevant information.
- If the fix will take too long, consider revert the code.

## Contributing to tbd-docs

View the contribution guide within the [tbd-docs](https://github.com/flutter-global/tbd-docs/) repo for details

## Further reading:

- [Micro Commits](https://lucasr.org/2011/01/29/micro-commits/)
- [Commit Messages](https://wiki.openstack.org/wiki/GitCommitMessages)
- [Git Commit Messages](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/)
