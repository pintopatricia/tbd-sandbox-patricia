const waitUntilEquals =
  (browser, options = { timeout: 10000 }) =>
  (element, text, errorMessage = `Test failed because ${text} is not equal to the text displayed`) => {
    const WAIT_UNTIL_EQUAL_TIMEOUT = options.timeout;
    return browser.waitUntil(
      async () => {
        try {
          if (!element) return false;
          const actual = (await element.getText()) || (await element.getValue());
          return actual === text;
        } catch {
          return false;
        }
      },
      {
        timeout: WAIT_UNTIL_EQUAL_TIMEOUT,
        timeoutMsg: errorMessage,
      },
    );
  };

module.exports = waitUntilEquals;
