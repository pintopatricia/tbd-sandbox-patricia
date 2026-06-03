const customCommands = require("@ppb/tbd-wdio-custom-commands");
const { findElementLazy, findElementsLazy } = require("@ppb/wdio-lazy-element");
const NetworkRecording = require("../services/network-recording-service");
const perfTestAndReport = require("../services/perf-reporting-service");

exports.config = {
  runner: "local",
  specs: ["../specs/{common,bf}/**.spec.js"],
  baseUrl: "http://ie1-tbd06-prf.prf.betfair:8080/betting/", // BF
  // baseUrl: "http://ie1-tbdsbg06-prf.prf.betfair:8080/", // SBG
  exclude: [
    // 'path/to/excluded/files'
  ],
  // execArgv: ["--inspect-brk"],
  maxInstances: 1,
  capabilities: [
    {
      browserName: "chrome",
      acceptInsecureCerts: true,

      "goog:chromeOptions": {
        args: ["--disable-web-security", "--incognito"],
        mobileEmulation: {
          deviceName: "iPhone 12 Pro",
        },
      },
    },
  ],
  logLevel: "error",
  bail: 0,
  sync: false,
  waitforTimeout: 20000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 5,
  services: [],
  framework: "jasmine",
  jasmineOpts: {
    defaultTimeoutInterval: 3000000,
  },
  reporters: [
    "spec",
    [
      "allure",
      {
        outputDir: "../../reports/allure-results",
        disableWebdriverStepsReporting: true,
      },
    ],
  ],
  beforeSession: () => {
    global.$ = findElementLazy;
    global.$$ = findElementsLazy;
  },
  before: async () => {
    Object.keys(customCommands).forEach((key) => browser.addCommand(key, customCommands[key](browser)));

    // set cookies
    await browser.url("/");
    await browser.newWindow("about:blank");
    await browser.switchWindow("/");
    await browser.setCookies({
      name: "vid",
      value: "12345678-1234-1234-1234-123456789012",
    });
    await browser.closeWindow();
    await browser.switchWindow("about:blank");
  },
  beforeHook: async (_, context) => {
    try {
      context.networkRecording = await NetworkRecording.getInstance(browser);
    } catch (error) {
      console.log(`NetworkRecording failed due to: ${error}`);
    }
  },
  afterTest: async (_, context, result) => {
    console.log("Terminating webdriver session...");
    await browser.closeWindow();
    await browser.deleteSession();
    await browser.overwriteCommand("deleteSession", () => {
      console.log("Session was already deleted");
    });

    if (!context.journeyName) {
      throw new Error("The test forgot to specify context.journeyName for perf test to run!");
    }

    if (result.passed) {
      await perfTestAndReport(context.journeyName, await context.networkRecording.getRecordedRequests());
    } else {
      console.log("Skipping performance test as the webdriverio suite failed.");
    }
  },
};
