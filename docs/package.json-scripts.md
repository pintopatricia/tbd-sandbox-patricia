# `package.json` scripts

What do they do? Glad you asked, here it is.

## The root package.json

To generate the config files with the secrets managed with the VAULT

- generate-config-files

### BFF related

- generate-bff-response-types
- generate-extracted-queries:store
- generate-extracted-queries:bff
- generate-bff-persisted-queries
- generate-sca-response-types
- compile-graphql

### Translations files

Get translation files from lokalize, using the [translations-tool](https://gitlab.app.betfair/global-scale/translations-tool).
Each script has its own configuration file.

- get-translations:shared
- get-translations:native:ios
- get-translations:native:android

Shortcut to run all "get-translations:\*" scripts.

- get-translations

Install the translations-tool.

- install-translations-tool

#### Filtering Unwanted Changes

A script has been added to help remove unwanted changes in specific directories. You can run the following command (with your own ARG(s)):

`yarn run filter-translations ARG1 ARG2`

In this example, the filter will retain only changes that contain the words **ARG1** or **ARG2** in the following directories:

- `apps/bf/native/android/app/src/main/res/`
- `apps/bf/native/ios/Settings/Settings.bundle/`
- `packages/tbd-shared/translations/`

**Note:** This script uses `git checkout -p`, which applies changes interactively. However, there are limitations to this approach. If two edits are too close together, you may not be able to selectively discard some changes. As a result, unwanted changes may still remain in the diff.

### Continuous Integration

- docs:madr-toc
- rpm
- eslint

### TODO

- storybook:local:dev
- build-storybook:local
- mono:check
- mono:test
- mono:test:branch
- mono:format
- mono:lint
- mono:prepublish
- mono:publish
- mono:typecheck
- worktree:root:test
- worktree:root:test:branch
- worktree:root:format
- worktree:root:lint
- worktree:root:prepublish
- worktree:root:publish
- worktree:root:typecheck
- worktree:catalog:schema:diff
- generate:global:coverage
- generate-config-files
- check:nodeversion
- syncpack:list
- syncpack:fix

## The apps/bf/web package.json

### Everyday scripts

Build the docker containers required for running the app. Consumes BFF from QA environment.

- build

Full build, including BFF, of the docker containers required for running the app.

- build:dev

Start every service needed to run the app consuming local BFF.

- start
- start:dev

Start every service needed to run the app consuming BFF from QA.

- start:qa

Start every service needed to run the app consuming BFF from QA CMS.

- start:qacms

Stops running docker containers.

- stop

### Production

- build:prod
- start:prod
- stop:prod

### Bundle

- build:local

Creates a dist folder and generates the bundle files (using webpack prd) to that folder.

- size

Runs bundlesize to check that each bundle file size is lower than the limit set. You can check
these limits [on bundlesize file](../apps/bf/web/bundlesize.config.json).

Note: to run this successfully you'll need to run `build:local` script first.

## The apps/bf/native package.json

### Everyday scripts

Build the docker containers required for running the app. Consumes BFF from QA environment.

- build

Full build, including BFF, of the docker containers required for running the app.

- build:dev

Start every service needed to run the app consuming local BFF.

- start
- start:dev

Start every service needed to run the app consuming BFF from QA.

- start:qa

Stops running docker containers.

- stop

Runs ios environment.

- ios
- ios:qa
