const waitUntilInViewport =
  (browser, options = { timeout: 8000 }) =>
  (element, errorMessage = "Element not in viewport") => {
    const WAIT_UNTIL_VISIBLE_TIMEOUT = options.timeout;
    return browser.waitUntil(async () => element && (await element.isDisplayedInViewport()), {
      timeout: WAIT_UNTIL_VISIBLE_TIMEOUT,
      timeoutMsg: errorMessage,
    });
  };

module.exports = waitUntilInViewport;
