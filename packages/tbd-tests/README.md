# Overview

This is a Webdriver.io test automation suite using JavaScript with a Jasmine test runner.

For each test suite (for example, E2E tests), the tests are split up into the following three directories:

## SBG

This is where tests that are exclusive to the Sky Betting & Gaming domains are.

## BF

This is where tests that are exclusive to the BetFair domains are.

## shared

This is where tests that can be run across either Sky Betting & Gaming or Betfair are.

---

# Running Tests

If this is your first time in the `tbd-tests` directory, we recommend running a `yarn install` to ensure all the correct packages have been installed.

## Web

To run tests you will need to have the following things in your command:
You will need to specify a `BASE_URL`. You can find more details on setting the test environment [here](#setting-environments)
You will need to specify a `ENV_BRAND`. You can find more details on setting the brand environment [here](#setting-brand)
You will need to specify a `SUITE` to run. You can find more details on setting the suite [here](#suites)

If you wanted to run SBG E2E tests, your command should look like this: `BASE_URL=nxt.sbg SUITE=e2e yarn wdio run ./wdio.conf.js`

To make things more straight forward we have created scripts (see [here](#scripts)) to allow you to easily run test suites.

---

## Native

Native regression and e2e tests live under `packages/tbd-tests/native/specs/`, organised by suite and brand (e.g. `specs/regression/bf/`, `specs/e2e/shared/`).

### Spec file naming

- **`.ios.spec.js`** – iOS only
- **`.android.spec.js`** – Android only
- **`.all.spec.js`** – both platforms

Use the `--file=<name>` option to run a single spec; the runner matches `<name>` against the base filename (without `.ios`/`.android`/`.all`).

### Disabled tests

Tests that should not run are excluded by filename: use **`.disabled`** after the platform suffix (e.g. `feature.android.disabled.spec.js`). All `**/*.disabled.spec.js` files are excluded in `native/config/wdio.conf.js`, so no setup runs for them.

### Local Debug

By default, when executing regression tests, the latest app will be fetched from artifactory and installed on the device.

If you intend to locally debug a test you have to provide your APK (android) or .app(IOS).

In order to make it a more developer-friendly process, a set of commands that already fetch latest APK/.app were added. They run with dev flag for extended logs and are compatible with file args

> `native:ios:visual:bf:mockserver:debug`

> `native:android:regression:bf:mockserver:debug`

Aditional information can be found here for [android](https://tbd.flutteruki.com/testing/test-guidelines/running-tests/android) and here for [ios](https://tbd.flutteruki.com/testing/test-guidelines/running-tests/iOS)

**Notes**:

1. Don't forget to modify apps/${brand}/native/.env and add `ENABLE_A11Y_TESTS_MODE=1` before running metro.
2. IOS appToInstall assumes you use XCODE 26 (or later)

---

### Setting brand

Which environment the tests run on is controlled by the environment variable `ENV_BRAND`. This can be one of:

- `sbg.nxt`
- `bf.drk`

`bf.drk` is used by default if `ENV_BRAND` is not specified.
You need to ensure the correct `ENV_BRAND` is set for the domain you want to run tests against.

To do this you will need to specify a `ENV_BRAND`.
For example, if I wish to run the SBG tests in the NXT environemnt you would need to add `ENV_BRAND=nxt.sbg` to the start of your command.

You will need to specify a `ENV_BRAND` (if one other than `bf.qa` is needed)

---

### Setting environments

Which endpoint the tests run on is controlled by the environment variable `BASE_URL`. This can be any endpoint of our applications. Example:

- `http://ie1-tbd-qa.qa.betfair/betting/`
- `https://www.betfair.com.qa.ppbdev.com/betting/`
- `https://www.skybet.com.qa.ppbdev.com/`

---

### Scripts

Scripts in the `package.json` have been created so that you can easily run the desired tests.
For example, `yarn run web:e2e:sbg:nxt` will run all tests inside the `sbg` and `shared` directory within the `e2e` directory against the NXT SBG (https://skybet.com.nxt.ppbdev.com/skybet/) domain.
Note that the above script will only run shared tests on the selected SBG domain and not the BF.

#### E2E

Scripts available:

- `yarn run web:e2e:sbg:qa`
- `yarn run web:e2e:bf:qa`

To run a single test file:

- `yarn run web:e2e:sbg:qa --file=bet-placement`
- `yarn run web:e2e:bf:qa --file=bet-placement`

#### Visual Tests

Scripts available for desktop visual:

- `yarn run web:visual:bf:qa`

To run a single test file:

- `yarn run web:visual:bf:qa --file=bet-placement`
- `BASE_URL=https://localhost.betfair.com/betting yarn run web:visual:bf:qa --file=bet-placement`

---

### Suites

Suites have been created in the `wdio.conf.js`.
The suites specify which tests to run for which suite.
For example, the `e2e` suite for sbg brand, when ran, will run all tests inside the `sbg` and `shared` directories inside the `e2e` directory. On other hand, the `e2e` suite for bf brand, when ran, will run all tests inside the `bf` and `shared` directories inside the `e2e` directory

---

### Data ( User credentials )

Vault paths for the user data are provided in `login-local.json` in the corresponding `config-tempalates` folder for each brand and each environment respectively.
When `yarn generate-config-files` is executed at the start, corresponding `login-local.json` with the vault data would be generated into the `config` folder for each section.
In the tests this can be used by importing `const { extractUserAndPassword } = require('../../config/extractCredentials.js';` and `const {user,password} = extractUserAndPassword(key); ` to extract values from the file for the ENV_BRAND defined in package.json

---

### Selenium Grid

To bring the local selenium grid up, ensure Docker is running, then run `yarn grid:local:start`. To view the local selenium grid, go to `http://localhost:4444/ui`. To run tests against the local grid, the environment variables `SELENIUM_HOST=localhost BASE_URL=X ENV_BRAND=Y` need to be added before running either the `yarn wdio:sbg:ci` or `yarn wdio:bf:ci` scripts.
For example: `SELENIUM_HOST=localhost BASE_URL=http://ie1-tbd-qa.qa.betfair/ ENV_BRAND=qa.bf yarn wdio:bf:ci`

To run against the hosted selenium grid, by not including the `SELENIUM_HOST` environment variable it will default to `ie2-tbdlsg01-qa.qa.betfair`, found in the `wdio-ci-conf.js` file.

When running tests in the release pipeline, we are planning on using a local selenium grid to remove the dependency on the status of the hosted selenium grid. The scripts `wdio:sbg:ci:localGrid` and `wdio:bf:ci:localGrid` will automatically start a local selenium grid and run against it, then stop them after.
