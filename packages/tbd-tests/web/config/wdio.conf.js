const lazyElementPackage = require("@ppb/wdio-lazy-element");
const yargs = require("yargs/yargs");
const { join } = require("path");
const { hideBin } = require("yargs/helpers");
const customCommands = require("@ppb/tbd-wdio-custom-commands");
const { getBrandEnv } = require("../../utils/conf.util");
const { registerHandlebarsHelpers } = require("../../utils/mock-essentials/register-handlebars");
const { saveScreenshotsAllure } = require("../../utils/save-screenshots-allure");
const { execSync } = require("child_process");
const path = require("path");

const { argv } = yargs(hideBin(process.argv));
const {
  ENV_BRAND,
  SUITE,
  GRID,
  SELENIUM_HOST,
  PORT,
  PROTOCOL,
  INSTANCES,
  FILE,
  MAX_INSTANCES,
  NUM_SPEC_RETRIES,
  BAIL_LIMIT,
  BASE_URL,
} = process.env;
const suite = SUITE || argv.suite || "e2e";
const useGrid = GRID === "true" || argv.grid === "true" || false;
const file = FILE || argv.file;
const { brand, environment } = getBrandEnv(ENV_BRAND);
process.env.BRAND = brand;
process.env.ENVIRONMENT = environment;
const visualTestsOpts = {
  diffBase: `./specs/visual/diff/`,
  diff: `./specs/visual/diff-waitUntilImageEquals/`,
  baseline: `./specs/visual/baselines/${brand}`,
  screenshotPath: "./specs/visual/",
  isMobileApp: false,
};

let areFontsMocked = true;

const specs = {
  e2e: {
    mobile: [
      `../specs/${suite}/shared/${file || "*.mobile"}.spec.js`,
      `../specs/${suite}/${brand}/${file || "*.mobile"}.spec.js`,
    ],
    desktop: [
      `../specs/${suite}/shared/${file || "*.desktop"}.spec.js`,
      `../specs/${suite}/${brand}/${file || "*.desktop"}.spec.js`,
    ],
  },
  visual: {
    desktop: [`../specs/${suite}/**/${file || "*.desktop"}.spec.js`],
    mobile: [`../specs/${suite}/**/${file || "*.mobile"}.spec.js`],
  },
  regression: {
    desktop: [`../specs/${suite}/**/${file || "*.desktop"}.spec.js`],
    mobile: [`../specs/${suite}/**/${file || "*.mobile"}.spec.js`],
  },
};

const getSpecs = ({ mobile }) => {
  if (suite in specs) {
    if (file) {
      if (mobile && file.includes("mobile")) {
        console.log("Running mobile spec:", specs[suite].mobile);
        return specs[suite].mobile;
      }

      if (!mobile && file.includes("desktop")) {
        console.log("Running desktop spec:", specs[suite].desktop);
        return specs[suite].desktop;
      }

      return [];
    }

    return mobile ? specs[suite].mobile : specs[suite].desktop;
  }
  throw new Error(`Unknown suite: ${suite}`);
};

const getServices = () => {
  if (suite === "visual") {
    return [
      [
        "image-comparison",
        {
          baselineFolder: join(process.cwd(), visualTestsOpts.baseline),
          screenshotPath: join(process.cwd(), visualTestsOpts.screenshotPath),
          formatImageName: "{tag}-{browserName}-{width}x{height}-dpr-{dpr}",
          saveAboveTolerance: 0.001,
          savePerInstance: true,
          autoSaveBaseline: false,
        },
      ],
    ];
  }
  return [];
};

const getGridConfig = () => ({
  hostname: SELENIUM_HOST || "ie1-tbdlsg01-qa.qa.betfair",
  port: +PORT || 4444,
  protocol: PROTOCOL || "http",
  strictSSL: false,
  path: "/wd/hub",
});

const getCapability = (isMobile = true) => ({
  browserName: "chrome",
  acceptInsecureCerts: true,
  maxInstances: INSTANCES || useGrid ? 5 : 1,
  "goog:chromeOptions": {
    ...(isMobile
      ? {
          mobileEmulation: {
            deviceName: "iPhone 6",
          },
        }
      : {}),
    args: [
      "--remote-allow-origins=*",
      "--disable-web-security",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--incognito",
      "--hide-scrollbars",
      ...(isMobile
        ? [
            "--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 13_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/118.0.0.0 Mobile/15E148 Safari/604.1",
          ]
        : [
            "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
          ]),
      ...(useGrid ? ["--headless"] : []),
      ...(isMobile ? [] : ["--window-size=1560,1021"]),
    ],
  },
});

exports.config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  runner: "local",

  injectGlobals: true,
  sync: false,

  ...(useGrid ? getGridConfig() : {}),

  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: "../../tsconfig.json",
    },
  },
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // of the configuration file being run.
  //
  // The specs are defined as an array of spec files (optionally using wildcards
  // that will be expanded). The test for each spec file will be run in a separate
  // worker process. In order to have a group of spec files run in the same worker
  // process simply enclose them in an array within the specs array.
  //
  // The path of the spec files will be resolved relative = require(the directory of
  // of the config file unless it's absolute.
  //
  specs: [`../specs/**/${file}.spec.js`],

  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],

  maxInstances: parseInt(MAX_INSTANCES || 0, 10) || 10,
  capabilities: [
    {
      ...getCapability(true), // Mobile capability
      specs: getSpecs({ mobile: true }),
    },
    {
      ...getCapability(false), // Desktop capability
      specs: getSpecs({ mobile: false }),
    },
  ],
  logLevel: "error",
  waitforTimeout: 30000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 5,
  services: getServices(),
  framework: "jasmine",
  specFileRetries: parseInt(NUM_SPEC_RETRIES || 0, 10),
  bail: parseInt(BAIL_LIMIT || 0, 10) || 0, // bail (default is 0 - don't bail, run all tests).
  reporters: [
    "spec",
    [
      "allure",
      {
        outputDir: "../../../reports/allure-results",
        disableWebdriverScreenshotsReporting: false,
        // disableWebdriverStepsReporting: true,
        // reportedEnvironmentVars: {
        // os_platform: os.platform(),
        // os_release: os.release(),
        // os_version: os.version(),
        // node_version: process.version,
        // },
      },
    ],
    [
      "junit",
      {
        outputDir: "../../../reports/junit",
        outputFileFormat: (options) => `junit-${options.cid}.xml`,
        addFileAttribute: true,
        testnameFormat: (title) => title.replace(/^([A-Z]+)\s(\d+)\b/, "$1-$2"),
      },
    ],
  ],

  onComplete: function () {
    const repoRoot = process.cwd(); // normalmente .../tbd
    const reportsDir = path.resolve(repoRoot, "../../../reports/junit");

    const scriptPath = path.resolve(__dirname, "../../utils/extractXrayData.js");

    execSync(`node "${scriptPath}" "${reportsDir}"`, { stdio: "inherit" });
  },

  // Options to be passed to Jasmine.
  jasmineOpts: {
    // Jasmine default timeout
    defaultTimeoutInterval: 90000,
    failFast: suite !== "visual",
    expectationResultHandler(passed, assertion) {
      // do something
    },
  },

  //
  // =====
  // Hooks
  // =====

  /**
   * Gets executed once before all workers get launched.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  onPrepare: () => {
    if (BASE_URL === undefined) {
      throw new Error("No BASE_URL variable set: ensure the correct environment URL is set");
    }
  },
  /**
   * Gets executed before a worker process is spawned and can be used to initialize specific service
   * for that worker as well as modify runtime environments in an async fashion.
   * @param  {string} cid      capability id (e.g 0-0)
   * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
   * @param  {object} specs    specs to be run in the worker process
   * @param  {object} args     object that will be merged with the main configuration once worker is initialized
   * @param  {object} execArgv list of string arguments passed to the worker process
   */
  // onWorkerStart: function (cid, caps, specs, args, execArgv) {
  // },
  /**
   * Gets executed just after a worker process has exited.
   * @param  {string} cid      capability id (e.g 0-0)
   * @param  {number} exitCode 0 - success, 1 - fail
   * @param  {object} specs    specs to be run in the worker process
   * @param  {number} retries  number of retries used
   */
  // onWorkerEnd: function (cid, exitCode, specs, retries) {
  // },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   * @param {string} cid worker id (e.g. 0-0)
   */
  beforeSession: () => {
    const { findElementLazy, findElementsLazy } = lazyElementPackage;
    global.$ = findElementLazy;
    global.$$ = findElementsLazy;

    // Mock fonts is mandatory for visual tests
    global.setMockedFonts = (value) => {
      areFontsMocked = value;
    };
    global.areFontsMocked = () => areFontsMocked;

    console.log(
      `Running tests for suite: ${suite}, brand: ${brand}, environment: ${environment}, baseUrl: ${BASE_URL}`,
    );
  },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs        List of spec file paths that are to be run
   * @param {object}         browser      instance of created browser/device session
   */
  before: async () => {
    Object.keys(customCommands).forEach((key) =>
      browser.addCommand(key, customCommands[key](browser, { visualTestsOpts })),
    );

    registerHandlebarsHelpers();
  },
  /**
   * Runs before a WebdriverIO command gets executed.
   * @param {string} commandName hook command name
   */
  beforeCommand: async (commandName) => {
    if (suite === "visual" && commandName === "url" && !global.areFontsMocked()) {
      console.error(
        "\n\nError! You should always call 'mockService.mockFonts' on visual tests in order to mock fonts\n",
      );
      process.exit(1);
    }
  },
  /**
   * Hook that gets executed before the suite starts
   * @param {object} suite suite details
   */
  // beforeSuite: function (suite) {
  // },
  /**
   * Function to be executed before a test (in Mocha/Jasmine) starts.
   */
  // beforeTest: async (test, context) => {
  // },
  /**
   * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
   * beforeEach in Mocha)
   */
  // beforeHook: function (test, context, hookName) {
  // },
  /**
   * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
   * afterEach in Mocha)
   */
  afterHook: async (test, _context, { error, passed }) => {
    await browser.addLogsToAllure(test);

    if (error || !passed) {
      await browser.takeScreenshot();
    }
  },
  /**
   * Function to be executed after a test (in Mocha/Jasmine only)
   * @param {object}  test             test object
   * @param {object}  context          scope object the test was executed with
   * @param {Error}   result.error     error object in case the test fails, otherwise `undefined`
   * @param {*}       result.result    return object of test function
   * @param {number}  result.duration  duration of test
   * @param {boolean} result.passed    true if test has passed, otherwise false
   * @param {object}  result.retries   information about spec related retries, e.g. `{ attempts: 0, limit: 0 }`
   */
  afterTest: async (test, _context, { error, passed }) => {
    if (suite === "visual") {
      global.setMockedFonts(false);
      await browser.addLogsToAllure(test);

      if (error || !passed) {
        const allureOpts = {
          ...visualTestsOpts,
          diff: visualTestsOpts.diffBase,
        };
        saveScreenshotsAllure(test, allureOpts);
      }
    } else {
      await browser.addLogsToAllure(test);

      if (error || !passed) {
        await browser.takeScreenshot();
      }
    }
  },

  /**
   * Hook that gets executed after the suite has ended
   * @param {object} suite suite details
   */
  // afterSuite: function (suite) {
  // },
  /**
   * Runs after a WebdriverIO command gets executed
   * @param {string} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {number} result 0 - command success, 1 - command error
   * @param {object} error error object if any
   */
  afterCommand: (commandName, args, result, error) => {
    if (suite === "visual" && commandName === "waitUntilImageEquals" && error) {
      saveScreenshotsAllure(
        {
          description: args[0],
        },
        visualTestsOpts,
      );
    }
  },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // after: function (result, capabilities, specs) {
  // },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // afterSession: function (config, capabilities, specs) {
  // },
  /**
   * Gets executed after all workers got shut down and the process is about to exit. An error
   * thrown in the onComplete hook will result in the test run failing.
   * @param {object} exitCode 0 - success, 1 - fail
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
  // onComplete: function(exitCode, config, capabilities, results) {
  // },
  /**
   * Gets executed when a refresh happens.
   * @param {string} oldSessionId session ID of the old session
   * @param {string} newSessionId session ID of the new session
   */
  // onReload: function(oldSessionId, newSessionId) {
  // }
  /**
   * Hook that gets executed before a WebdriverIO assertion happens.
   * @param {object} params information about the assertion to be executed
   */
  // beforeAssertion: function(params) {
  // }
  /**
   * Hook that gets executed after a WebdriverIO assertion happened.
   * @param {object} params information about the assertion that was executed, including its results
   */
  // afterAssertion: function(params) {
  // }
};
