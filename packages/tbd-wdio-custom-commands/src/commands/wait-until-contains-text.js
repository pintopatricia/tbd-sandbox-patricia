const waitUntilContainsText =
  (browser, options = { timeout: 10000 }) =>
  (element, text, errorMessage = `Test failed because the element doesn't contains ${text}`) => {
    const WAIT_UNTIL_CONTAINS_TEXT_TIMEOUT = options.timeout;

    return browser.waitUntil(
      async () => element && ((await element.getText()) || (await element.getValue())).includes(text),
      {
        timeout: WAIT_UNTIL_CONTAINS_TEXT_TIMEOUT,
        timeoutMsg: errorMessage,
      },
    );
  };

module.exports = waitUntilContainsText;
