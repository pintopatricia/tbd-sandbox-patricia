require("dotenv").config();

const customCommands = require("@ppb/tbd-wdio-custom-commands");
const { findElementLazy, findElementsLazy } = require("@ppb/wdio-lazy-element");
const { argv } = require("yargs");
const {
  updateInstalledApp,
  getPackageName,
  getMainActivity,
  artifactoryBaseUrl,
  appName,
  appExtension,
  getBundleId,
} = require("./helpers/app-version-management");
const { stopAndSaveVideo } = require("./helpers/allure");
const { registerHandlebarsHelpers } = require("../../utils/mock-essentials/register-handlebars");
const { createProxyInstance } = require("../helpers/create-proxy-instance");
const { closeProxyInstance } = require("../helpers/close-proxy-instance");

let containerIds = [];

const {
  WAIT_FOR_TIMEOUT,
  CONNECTION_RETRY_TIMEOUT,
  IE1_GRID_CONFIG,
  IE2_GRID_CONFIG,
  IE1_IOS_GRID_CONFIG,
  DEV_TIMEOUT,
  JASMINE_TIMEOUT,
  BF_AVD,
  SBG_AVD,
  BF_IOS_DEVICE_NAME,
  SBG_IOS_DEVICE_NAME,
  BF_IOS_PLATFORM_VERSION,
  SBG_IOS_PLATFORM_VERSION,
} = require("./consts");
const { join } = require("path");
const downloadBaseline = require("../helpers/download-baseline");
const { fetchJSBundle } = require("./helpers/fetch-js-bundle");
const { getUnusedPort } = require("./helpers/get-unused-port");
const { saveScreenshotsAllure } = require("../../utils/save-screenshots-allure");

const {
  SUITE,
  GRID,
  GRID_HOST,
  FILE,
  MAX_INSTANCES,
  NUM_SPEC_RETRIES,
  BAIL_LIMIT,
  PLATFORM,
  BRAND,
  ENV,
  BUILD_TYPE,
  APPIUM_HOME,
} = process.env;

// TODO: FIXME: This is a temporary fix to ensure the APPIUM_HOME is set correctly
process.env.APPIUM_HOME = APPIUM_HOME || "../../../node_modules/appium/";
process.env.APPIUM_PATH = `${process.env.APPIUM_HOME}/node_modules/.bin/appium`;

console.log(`APPIUM_HOME: ${process.env.APPIUM_HOME}`);

const suite = SUITE || argv.suite || "e2e";
const useRealDate = suite === "e2e" || suite === "smoke";
const useGrid = GRID === "true" || argv.grid === "true" || false;
const file = FILE || argv.file || "*";
const brand = BRAND || argv.brand || "bf";
const environment = ENV || argv.environment || "qa";
const buildType = BUILD_TYPE || argv.buildType || "inhouse";
process.env.ENVIRONMENT = environment;
process.env.BRAND = brand;
process.env.BUILD_TYPE = buildType;
const platform = PLATFORM || argv.platform || "android";
const appId = getPackageName(platform, brand, buildType);
const baselineFolder =
  platform === "ios"
    ? `baselines/${brand}/${platform}/tbd-native-visual-tests-baseline/baselines`
    : `baselines/${brand}/${platform}/`;
const isDevelopmentMode = (argv.dev || process.env.DEV) === "true";
const isToRecordVideo = (argv.recordVideo || process.env.recordVideo) === "true";
const visualTestsOpts = {
  diffBase: `./specs/visual/diff/`,
  diff: `./specs/visual/diff-waitUntilImageEquals/`,
  baseline: `./specs/visual/${baselineFolder}`,
  screenshotPath: "./specs/visual/",
  isMobileApp: true,
};

const specs = {
  e2e: {
    android: [
      `../specs/${suite}/shared/**/${file}.android.spec.js`,
      `../specs/${suite}/shared/**/${file}.all.spec.js`,
      `../specs/${suite}/${brand}/**/${file}.android.spec.js`,
      `../specs/${suite}/${brand}/**/${file}.all.spec.js`,
    ],
    ios: [
      `../specs/${suite}/shared/**/${file}.ios.spec.js`,
      `../specs/${suite}/shared/**/${file}.all.spec.js`,
      `../specs/${suite}/${brand}/**/${file}.ios.spec.js`,
      `../specs/${suite}/${brand}/**/${file}.all.spec.js`,
    ],
  },
  regression: {
    android: [
      `../specs/${suite}/shared/**/${file}.android.spec.js`,
      `../specs/${suite}/shared/**/${file}.all.spec.js`,
      `../specs/${suite}/${brand}/**/${file}.android.spec.js`,
      `../specs/${suite}/${brand}/**/${file}.all.spec.js`,
    ],
    ios: [
      `../specs/${suite}/shared/**/${file}.ios.spec.js`,
      `../specs/${suite}/shared/**/${file}.all.spec.js`,
      `../specs/${suite}/${brand}/**/${file}.ios.spec.js`,
      `../specs/${suite}/${brand}/**/${file}.all.spec.js`,
    ],
  },
  visual: {
    android: [
      `../specs/${suite}/shared/**/${file}.android.spec.js`,
      `../specs/${suite}/shared/**/${file}.all.spec.js`,
      `../specs/${suite}/${brand}/**/${file}.android.spec.js`,
      `../specs/${suite}/${brand}/**/${file}.all.spec.js`,
    ],
    ios: [
      `../specs/${suite}/shared/**/${file}.ios.spec.js`,
      `../specs/${suite}/shared/**/${file}.all.spec.js`,
      `../specs/${suite}/${brand}/**/${file}.ios.spec.js`,
      `../specs/${suite}/${brand}/**/${file}.all.spec.js`,
    ],
  },
  smoke: {
    android: [
      "../specs/e2e/shared/sbk-re-use-multiple-selection.android.spec.js",
      "../specs/e2e/shared/log-out.android.spec.js",
    ],
  },
};
console.log(
  `Running suite: ${suite}, platform: ${platform}, brand: ${brand}, env: ${environment}, buildType: ${buildType}`,
);

const getGridConfig = () => {
  let gridConfig = {};
  if (platform === "ios") {
    gridConfig = IE1_IOS_GRID_CONFIG;
  } else {
    gridConfig = GRID_HOST === "ie1" ? IE1_GRID_CONFIG : IE2_GRID_CONFIG;
  }

  console.log("Using grid config: ", gridConfig);
  return gridConfig;
};

const getAppToInstall = () => {
  const appToInstall =
    argv.appToInstall ||
    process.env.appToInstall ||
    (platform === "android" && process.env.APK) ||
    `${artifactoryBaseUrl[platform][brand]}${appName[platform][brand]}${
      process.env.BUILD_NUMBER ? `${process.env.BUILD_NUMBER}` : "latest"
    }.${appExtension[platform][brand]}`;

  console.log("appToInstall: ", appToInstall);
  return appToInstall;
};

const getDevCapabilities = () => ({
  ...(platform === "android"
    ? {
        "appium:appWaitActivity": getMainActivity(brand),
        "appium:appWaitDuration": DEV_TIMEOUT,
        "appium:androidDeviceReadyTimeout": DEV_TIMEOUT,
        "appium:newCommandTimeout": DEV_TIMEOUT / 100,

        "appium:avd": brand === "bf" ? BF_AVD : SBG_AVD,
        "appium:ignoreUnimportantViews": true,
        "appium:settings[ignoreUnimportantViews]": true,
        "appium:autoLaunch": false,

        "appium:disableAnimations": undefined,
      }
    : {
        "appium:waitForQuiescence": false,
        "appium:wdaEventloopIdleDelay": 3,
        "appium:newCommandTimeout": DEV_TIMEOUT / 100,
        "appium:deviceName": brand === "bf" ? BF_IOS_DEVICE_NAME : SBG_IOS_DEVICE_NAME,
        "appium:platformVersion":
          brand === "bf" ? BF_IOS_PLATFORM_VERSION.match(/\d+\.\d+/)[0] : SBG_IOS_PLATFORM_VERSION.match(/\d+\.\d+/)[0],
      }),
});

const getNonDevCapabilities = () => ({
  "appium:mjpegServerPort": 1,
  ...(platform === "ios"
    ? {
        "appium:useNewWDA": true,
      }
    : {}),
});

const customCookies = process.env.CUSTOM_COOKIES || argv.customCookies;
const customEnv = process.env.CUSTOM_ENV || argv.customEnv;

const getOptionalIntentArguments = () => {
  if (!useRealDate) {
    return "ToBeOverridenAtOnPrepareHook";
  }

  const args = [
    `--es environment ${environment}`,
    "--es e2e true",
    ...(customCookies ? [`--es custom_cookies ${customCookies}`] : []),
    ...(customEnv ? [`--es custom_environment ${customEnv}`] : []),
  ];

  return args.join(" ");
};

const getProcessArguments = () => {
  if (!useRealDate) {
    return {};
  }

  return {
    "appium:processArguments": {
      args: [
        "--environment=qa",
        "--e2e=true",
        ...(customCookies ? [`--custom_cookies=${customCookies}`] : []),
        ...(customEnv ? [`--custom_environment=${customEnv}`] : []),
      ],
    },
  };
};

const getCapabilities = () => {
  const capability = {
    "appium:orientation": "PORTRAIT",
    "appium:maxInstances": parseInt(MAX_INSTANCES || 1, 10),
    "appium:resetOnSessionStartOnly": true,
    "appium:newCommandTimeout": 240,
    "appium:autoAcceptAlerts": true,
    "appium:autoDismissAlerts": true,
    "appium:processArguments": {
      args: ["ToBeOverridenAtOnPrepareHook"],
      env: {
        HIDE_CONSENT: "YES",
      },
    },
    "appium:recordVideo": isToRecordVideo,
    "appium:app": getAppToInstall(),
    ...(platform === "android"
      ? {
          "appium:platformName": "Android",
          "appium:autoGrantPermissions": true,
          "appium:appWaitDuration": 20000,
          "appium:adbExecTimeout": 80000,
          "appium:androidDeviceReadyTimeout": 5,
          "appium:ignoreUnimportantViews": true,
          "appium:autoLaunch": false,
          "appium:automationName": "UiAutomator2",
          "appium:optionalIntentArguments": getOptionalIntentArguments(),
          "appium:disableAnimations": "true",
          "appium:fullReset": true,
        }
      : {
          "appium:platformName": "iOS",
          "appium:platformVersion": "26.2",
          "appium:deviceName": "iPhone 14",
          "appium:automationName": "XCUITest",
          "appium:isHeadless": useGrid,
          "appium:launchWithIDB": true,
          "appium:fullReset": false,
          "appium:autoAcceptAlerts": true,
          "appium:autoDismissAlerts": true,
          "appium:maxInstances": argv.maxInstances || 1,
          "appium:wdaLaunchTimeout": 120000,
          "appium:wdaStartupRetries": 4,
          "appium:wdaStartupRetryInterval": 20000,
          "appium:simulatorStartupTimeout": 60000,
          "appium:settings[snapshotMaxDepth]": 62,
          "appium:settings[customSnapshotTimeout]": 60,
          ...getProcessArguments(),
        }),
    ...(!useGrid ? getDevCapabilities() : getNonDevCapabilities()),
  };

  return [capability];
};

const getServices = () => {
  const services = [];
  if (!useGrid) {
    services.push([
      "appium",
      {
        logPath: "./reports/",
        command: "appium",
      },
    ]);
  }

  if (suite === "visual") {
    services.push([
      "native-app-compare",
      {
        baselineFolder: join(process.cwd(), visualTestsOpts.baseline),
        screenshotPath: join(process.cwd(), visualTestsOpts.screenshotPath),
        imageNameFormat: "{tag}",
        blockOutStatusBar: true,
        blockOutToolBar: true,
        blockOutNavigationBar: true,
        blockOutIphoneHomeBar: true,
        savePerInstance: true,
        autoSaveBaseline: false,
      },
    ]);
  }

  return services;
};

exports.config = {
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

  specs: specs[suite][platform],

  // Patterns to exclude.
  exclude: ["../specs/**/*.disabled.spec.js"],

  maxInstances: parseInt(MAX_INSTANCES || 1, 10),

  capabilities: getCapabilities(),

  logLevel: isDevelopmentMode ? "debug" : "error",

  "graphQL:validate": isDevelopmentMode,
  waitforTimeout: WAIT_FOR_TIMEOUT,
  connectionRetryTimeout: CONNECTION_RETRY_TIMEOUT,
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

  jasmineOpts: {
    defaultTimeoutInterval: isDevelopmentMode ? DEV_TIMEOUT : JASMINE_TIMEOUT,
    failFast: suite === "visual",
    helpers: [require.resolve("@babel/register")],
  },
  mockserver: {
    openIngressPorts: [
      10000, 10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010, 10011, 10012, 10013, 10014, 3000,
      40080, 8580, 9580, 8830, 40081,
    ],
  },

  async onPrepare(_config, capabilities) {
    process.on("SIGINT", async () => {
      console.log("Received SIGINT, closing session...");
      await browser?.deleteSession();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("Received SIGTERM, closing session...");
      await browser?.deleteSession();
      process.exit(0);
    });

    if (platform === "ios" && suite === "visual") {
      await downloadBaseline();
    }

    if (isDevelopmentMode) {
      await fetchJSBundle(capabilities);
    }
  },

  async beforeSession(config, capabilities, _specs, cid) {
    global.$ = findElementLazy;
    global.$$ = findElementsLazy;

    if (capabilities.recordVideo || capabilities["appium:recordVideo"]) {
      capabilities["appium:mjpegServerPort"] = await getUnusedPort();
    }

    if (!useRealDate) {
      const cidIndex = parseInt(cid.replace(/\D/g, ""), 10) || 0;

      // stagger the first start of the mockserver instances
      if (cidIndex < config.maxInstances) {
        const delayMs = (cidIndex % 10) * 1000;
        await new Promise((resolve) => {
          setTimeout(resolve, delayMs);
        });
      }

      const { openIngressPorts } = config.mockserver;
      containerIds = await createProxyInstance(capabilities, openIngressPorts, containerIds, cidIndex);
    }
  },

  async before() {
    if (browser.capabilities.recordVideo || browser.capabilities["appium:recordVideo"]) {
      console.log("Starting to record the video on before Hook on port ", browser.capabilities.mjpegServerPort);

      if (driver.isIOS) {
        await driver.startRecordingScreen({
          videoType: "h264_videotoolbox",
        });
      } else {
        await driver.startRecordingScreen({ bitRate: 5000000, videoSize: "600x400" });
      }
    }

    if (browser.capabilities["server:CONFIG_UUID"]) {
      console.log(`Running on slave with server:CONFIG_UUID: ${browser.capabilities["server:CONFIG_UUID"]}`);
    }

    await updateInstalledApp(platform, brand, appId, getAppToInstall());

    Object.keys(customCommands).forEach((key) =>
      browser.addCommand(key, customCommands[key](browser, { visualTestsOpts })),
    );
    global.$ = findElementLazy;
    global.$$ = findElementsLazy;
    registerHandlebarsHelpers();
  },

  async afterHook(_test, _context, { error, passed }) {
    if (error || !passed) {
      await browser.takeScreenshot();

      console.log("Stopping video record on afterHook Hook port ", browser.capabilities.mjpegServerPort);
      // Debug
      if (browser.capabilities["server:CONFIG_UUID"]) {
        console.log(`VIDEO afterHook:CONFIG_UUID: ${browser.capabilities["server:CONFIG_UUID"]}`);
      }
      await stopAndSaveVideo();
    }
  },

  async afterTest(test, _context, { error, passed }) {
    if (error || !passed) {
      if (suite === "visual") {
        const allureOpts = {
          ...visualTestsOpts,
          diff: visualTestsOpts.diffBase,
        };
        try {
          saveScreenshotsAllure(test, allureOpts);
        } catch (error) {
          console.log("Failed to save screenshot");
          console.log(error);
        }
      }
      await browser?.takeScreenshot();

      console.log("Stopping video record on afterTest Hook port ", browser.capabilities.mjpegServerPort);
      // Debug
      if (browser?.capabilities["server:CONFIG_UUID"]) {
        console.log(`VIDEO afterTest:CONFIG_UUID: ${browser.capabilities["server:CONFIG_UUID"]}`);
      }
      await stopAndSaveVideo();
    }
  },

  /**
   * Runs after a WebdriverIO command gets executed
   * @param {string} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {number} result 0 - command success, 1 - command error
   * @param {object} error error object if any
   */
  afterCommand: (commandName, args, result, error) => {
    if (suite === "visual" && commandName === "waitUntilImageEquals" && error) {
      try {
        saveScreenshotsAllure(
          {
            description: args[0],
          },
          visualTestsOpts,
        );
      } catch (error) {
        console.log("Failed to save screenshot");
        console.log(error);
      }
    }
  },

  async afterSession() {
    containerIds = await closeProxyInstance(containerIds);
  },

  async after() {
    if (browser.capabilities.recordVideo || browser.capabilities["appium:recordVideo"]) {
      console.log("Stopping video record on after Hook port ", browser.capabilities.mjpegServerPort);
      // Debug
      if (browser.capabilities["server:CONFIG_UUID"]) {
        console.log(`VIDEO after:CONFIG_UUID: ${browser.capabilities["server:CONFIG_UUID"]}`);
      }
      await driver.stopRecordingScreen();
    }

    containerIds = await closeProxyInstance(containerIds);
    const appId = getBundleId(platform, brand, buildType);
    console.log(`Test finished, terminating ${appId}`);
    await browser.terminateApp(appId);
  },
};
