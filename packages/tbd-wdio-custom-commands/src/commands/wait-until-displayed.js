const waitUntilDisplayed =
  (browser, options = { timeout: 8000 }) =>
  (element, errorMessage = "Element not visible", commandOptions = {}) => {
    const WAIT_UNTIL_VISIBLE_TIMEOUT = options.timeout;
    const displayCondition = browser.waitUntil(async () => element && (await element.isDisplayed()), {
      timeout: WAIT_UNTIL_VISIBLE_TIMEOUT,
      timeoutMsg: errorMessage,
    });
    const allWaitConditions = [displayCondition];

    // If specified, a grace period is set to wait for the element to be displayed
    // When not displayed the test continues normally
    // Useful for scenarios where you want to attempt waiting for something several times without failing the test (e2e for example)
    // Only failing when no grace period is defined.
    if (commandOptions?.timeout) {
      const timeout = new Promise((resolve) => {
        setTimeout(() => resolve(false), commandOptions.timeout);
      });

      allWaitConditions.push(timeout);
    }

    return Promise.race(allWaitConditions);
  };

module.exports = waitUntilDisplayed;
