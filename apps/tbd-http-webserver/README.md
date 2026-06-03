# BFF HTTP WEB SERVER

This is the _tbd-http-webserver_ used on the startup of the web app.

This strand returns html for the web app. It contains some pre-populated json variables (initial state, preloaded data, environments) for the web app to immediately hydrate the store.

--

## Project Setup

--

#### Scripts

> `clean`

Cleans the target directory.

> `build`

This script runs in the strand pipeline job

**Makes a production build (npm --prod)**
Creates the target directory with needed files.
Then, it transpiles the needed Typescript dependencies.

> `docker:build`
> Builds a docker image based on fabric-bookworm-slim image, with the http-webserver as target strand to be executed

> `docker:run`
> Runs a docker container with http-webserver strand exposed in port 8081

> `docker:debug`
> Spins up the docker container with strand being run in debug mode (debuggable in Chrome - node inspector; port 9229) with live reload.

TODO note:

- this will be fixed in the near future: strand only reload code under lib/ directory, _i.e._, it reload deps that have were changed locally (for instance, `tbd-store`)
- it does a production install, i.e., all deps must be published in Artifactory.

## Querying

Basic

```bash
curl --header "X-Request-URI: skybet/football/s-1" --cookie "ssoid=KZ5QCdqMvDf5IkKO2Od8XLUI+Xb57mtrJRrM5P8bSdU=" "127.0.0.1:8081/api?_ak=Q5vPQGFHSYfsasIo&requestHost=skybet.com"

curl --header "X-Request-URI: skybet/" "127.0.0.1:8081/api?_ak=Q5vPQGFHSYfsasIo&requestHost=skybet.com"
```

## Unit tests

In `.test.js` files

## Testing

This section provides an overview of the tools, practices, and standards we use to maintain a high-quality and reliable codebase through comprehensive testing. It is intended to guide contributors in writing, executing, and debugging tests across the entire stack. It is divided into key sections to ensure a structured and effective start:

1. [How to Test Manually](./docs/tests/test-manually.md)
2. [Automated Regression Tests](./regression-tests/README.md)
3. [Essential Checks for a TBD-HTTP-WEBSERVER Version Release](./docs/tests/version-released.md)

### Building Local Changes

Using `tbd_bff_access_control_ci_build_branch` jenkins job, it is possible to generate builds for usage in QA_branch without polluting the main build job. The branch job will take a branch as parameter (with master being the default value), and generate a build for http-webserver, with the suffix `_BRANCH` (1.0.0-10_BRANCH, for instance). To use this in the QA_branch environment, replace the version on `tbd-mobile-site.spec` with the one just generated on your branch and deploy to QA_branch as usual.
