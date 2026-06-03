const waitUntilResult =
  (browser, options = { timeout: 10000 }) =>
  (condition, result, errorMessage = "The condition is empty") => {
    const WAIT_UNTIL_EQUAL_TIMEOUT = options.timeout;
    return browser.waitUntil(async () => condition && (await condition) === result, {
      timeout: WAIT_UNTIL_EQUAL_TIMEOUT,
      timeoutMsg: errorMessage,
    });
  };

module.exports = waitUntilResult;
