const waitUntilLengthCondition =
  (browser, options = { timeout: 10000 }) =>
  (
    element,
    conditionFn,
    errorMessage = `Test failed because element length ${element.length} is not true in condition ${conditionFn}`,
  ) => {
    const WAIT_UNTIL_LENGTH_CONDITION_TIMEOUT = options.timeout;
    return browser.waitUntil(async () => element && conditionFn(await element.length), {
      timeout: WAIT_UNTIL_LENGTH_CONDITION_TIMEOUT,
      timeoutMsg: errorMessage,
    });
  };

module.exports = waitUntilLengthCondition;
