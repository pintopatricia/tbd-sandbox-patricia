const { join } = require("path");

/**
 * @typedef {Object} WaitUntilImageEqualsOptions
 * @property {number} [timeout] - The timeout for the waitUntil. Defaults to 50000.
 * @property {Object} visualTestsOpts - The options for the visual tests
 * @property {string} visualTestsOpts.diff - The path to the diff folder
 * @property {boolean} visualTestsOpts.isMobileApp - Whether the test is running on a mobile app
 */

/**
 * Wait until the image equals the baseline image
 * @param {WebdriverIO.Browser} browser - The browser object
 * @param {WaitUntilImageEqualsOptions} [options] - The options for the waitUntilImageEquals
 */
const waitUntilImageEquals =
  (browser, options = { timeout: 10000, visualTestsOpts: undefined }) =>
  /**
   * @param {string} imageName - The file name of the baseline image to compare against
   * @param {WebdriverIO.Element} [rootElement] - The root element to compare
   * @param {string} [errorMessage] - The error message to display if the image does not equal the baseline
   * @returns {Promise<boolean>}
   */
  (imageName, rootElement, errorMessage = `Test failed because baseline is not equal to the image given`) => {
    if (!options.visualTestsOpts) throw new Error("visualTestsOpts parameter is mandatory");
    const WAIT_UNTIL_EQUAL_TIMEOUT = options.timeout;
    const methodOptions = {
      diffFolder: join(process.cwd(), options.visualTestsOpts.diff),
    };

    // Due to the Jasmine 4.0 release, the it/describe after a failed before never run. Since we want to run them for reporting purposes, we want to "never fail" a before when the images are wrong, so the it itself is ran. We're waiting until a given image doesn't have more than X mismatches.
    const lastMismatch = [];
    return browser.waitUntil(
      async () => {
        // Used by the checkScreen
        if (rootElement) {
          const actualMismatch = await browser.checkElement(rootElement, imageName, methodOptions);
          if (actualMismatch === 0) return true;
          const mismatchMatched = lastMismatch.filter((elemMismatch) => elemMismatch === actualMismatch);
          lastMismatch.push(actualMismatch);
          return mismatchMatched.length > 4;
        }

        if (options.visualTestsOpts.isMobileApp) {
          const actualMismatch = (await browser.compareScreen(`${methodOptions.diffFolder}/${imageName}`))
            .misMatchPercentage;
          // In native we can't disable animations, so we'll have to wait for a X number of times of "0" to consider it stable.
          const isMatched = lastMismatch.filter((elemMismatch) => elemMismatch === 0);
          if (isMatched.length > 1) return true;
          const mismatchMatched = lastMismatch.filter((elemMismatch) => elemMismatch === actualMismatch);
          lastMismatch.push(actualMismatch);
          return mismatchMatched.length > 4;
        }

        const actualMismatch = await browser.checkScreen(imageName, methodOptions);
        if (actualMismatch === 0) return true;
        const mismatchMatched = lastMismatch.filter((elemMismatch) => elemMismatch === actualMismatch);
        lastMismatch.push(actualMismatch);
        return mismatchMatched.length > 4;
      },
      {
        timeout: WAIT_UNTIL_EQUAL_TIMEOUT,
        timeoutMsg: errorMessage,
        interval: 1000,
      },
    );
  };

module.exports = waitUntilImageEquals;
