const waitUntilContainsClass =
  (browser, options = { timeout: 8000 }) =>
  (element, testClass, errorMessage = `Element does not contain class ${testClass}`) => {
    const WAIT_UNTIL_VISIBLE_TIMEOUT = options.timeout;

    return browser.waitUntil(
      async () => {
        if (!element) {
          return false;
        }
        const className = await element.getAttribute("class");
        return className.indexOf(testClass) !== -1;
      },
      { timeout: WAIT_UNTIL_VISIBLE_TIMEOUT, timeoutMsg: errorMessage },
    );
  };

module.exports = waitUntilContainsClass;
