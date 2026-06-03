const waitUntilNotInDOM =
  (browser, options = { timeout: 8000 }) =>
  (element, timeoutMsg = "The given element is present on the DOM") => {
    const WAIT_UNTIL_VISIBLE_TIMEOUT = options.timeout;
    return browser.waitUntil(async () => (await element.getElement()) === undefined || !(await element.isExisting()), {
      timeout: WAIT_UNTIL_VISIBLE_TIMEOUT,
      timeoutMsg,
    });
  };

module.exports = waitUntilNotInDOM;
