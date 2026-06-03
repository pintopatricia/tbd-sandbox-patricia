Anyone contributing to TBDN please know that changes involve more than just code.

We follow this [project guidelines](https://flutteruki.atlassian.net/wiki/spaces/BSBG/pages/145377973/Project+Guidelines).

Your contribution is not done until you have made sure it meets all of these requirements.

1. Clear description explaining the relevancy of the contribution (e.g. link to User Story; an issue in the [issues tracker](https://github.com/Flutter-Global/tbd/issues)).
2. Working and clean code that is commented where needed.
3. Have all the acceptance criteria implemented as specified in the User Story.
4. [Components, Integration and E2E](https://flutteruki.atlassian.net/wiki/spaces/BSBG/pages/145370525/Test+Definition) that all pass on the CI server.
5. Performance/scalability implications have been considered, addressed, and tested.
6. Changelog entry added, if necessary.
7. Reviewed by relevant (UX/FE/BE/QA/Arch) reviewers and all concerns are addressed.
8. Merged by a project maintainer.
9. User Story is signed off by the QA and product owner.

# Contribution guide

## Branching

Every development must be done in a dedicated branch and merged into master via [Pull Request](https://github.com/Flutter-Global/tbd/pulls).

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

- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **revert**: A commit that reverts a previous one
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

NOTE: There are some tools that can help with this `types` like [commitizen](https://github.com/commitizen/cz-cli).

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
a [PR template](https://github.com/Flutter-Global/tbd/blob/master/.github/PULL_REQUEST_TEMPLATE.md)
for new features that you should use when creating the MR.

### Submitter obligations

- Be nice and respect everyone's comments
- You should answer all you MR comments
- Notify the reviewers every time the MR is ready to be reviewed again
- Resolving all discussions, except when agreed otherwise with the member
  commenting the MR
- The person who starts the discussion, should resolve it as soon as the discussion is solved.
- If the discussion is getting too extensive or hard to understand through
  comments, have face to face discussions

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

- **Must** have two :thumbsup: and at least one from project maintainers to be merged into master
- **Must** not have any :thumbsdown:
- **Must** have all discussions resolved before merging
- **Must** pass all tests and linting rules
- **Must** have the pipeline free and not broken (eg. no other MR running on the pipeline; do not accept a MR if a test has broken the pipeline)
- **Should** remove the source branch when the merge is accepted
- **Should** have branch ready for a fast-forward merge
- **Should** have commits squashed into meaningful commits
- **Should** have all relevant items from the Checklist checked (eg. "Tested by QA")

## Further reading:

- [Micro Commits](https://lucasr.org/2011/01/29/micro-commits/)
- [Commit Messages](https://wiki.openstack.org/wiki/GitCommitMessages)
- [Git Commit Messages](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/)
