const { addArgument, addAttachment } = require("@wdio/allure-reporter");

const FILENAME_REGEX = /([^/]+\.spec\.js)/;

const addLogsToAllure =
  (browser) =>
  async (test, filenameRegex = FILENAME_REGEX) => {
    const logs = browser.getLogs ? await browser.getLogs("browser") : undefined;

    if (test?.failedExpectations?.length > 0) {
      const result = test.failedExpectations[0].stack?.match(filenameRegex);
      const filename = result && result[0];
      addArgument("filename", filename);
    }

    if (logs?.length) {
      addAttachment("Browser console Logs", logs, "application/json");
    }
  };

module.exports = addLogsToAllure;
