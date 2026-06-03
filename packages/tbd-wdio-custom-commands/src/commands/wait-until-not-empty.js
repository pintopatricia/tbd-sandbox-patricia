const waitUntilNotEmpty =
  (browser, options = { timeout: 10000 }) =>
  (element, errorMessage = "The element's text is still empty") => {
    const WAIT_UNTIL_EQUAL_TIMEOUT = options.timeout;
    return browser.waitUntil(async () => element && ((await element.getText()) && (await element.getValue())) !== "", {
      timeout: WAIT_UNTIL_EQUAL_TIMEOUT,
      timeoutMsg: errorMessage,
    });
  };

module.exports = waitUntilNotEmpty;
