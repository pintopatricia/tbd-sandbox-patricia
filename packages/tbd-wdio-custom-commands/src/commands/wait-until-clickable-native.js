const waitUntilClickableNative =
  (browser, options = { timeout: 10000 }) =>
  (element, errorMessage = `Test failed because element is not clickable (visible/enabled)`) => {
    const WAIT_UNTIL_EQUAL_TIMEOUT = options.timeout;
    return browser.waitUntil(async () => element && (await element.isDisplayed()) && (await element.isEnabled()), {
      timeout: WAIT_UNTIL_EQUAL_TIMEOUT,
      timeoutMsg: errorMessage,
    });
  };

module.exports = waitUntilClickableNative;
