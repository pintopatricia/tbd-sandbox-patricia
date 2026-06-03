const waitUntilNotDisplayed =
  (browser, options = { timeout: 8000 }) =>
  (element, errorMessage = "Element not visible") => {
    const WAIT_UNTIL_NOT_VISIBLE_TIMEOUT = options.timeout;
    return browser.waitUntil(async () => element && !(await element.isDisplayed()), {
      timeout: WAIT_UNTIL_NOT_VISIBLE_TIMEOUT,
      timeoutMsg: errorMessage,
    });
  };

module.exports = waitUntilNotDisplayed;
