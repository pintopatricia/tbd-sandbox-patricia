const waitUntilAttributeContains =
  (browser, options = { timeout: 8000 }) =>
  (element, attribute, matcher, errorMessage = `Element does not contain ${matcher} in ${attribute}`) => {
    const WAIT_UNTIL_AVAILABLE_TIMEOUT = options.timeout;

    return browser.waitUntil(
      async () => {
        if (!element) {
          return false;
        }
        const attr = await element.getAttribute(attribute);
        return attr.includes(matcher);
      },
      { timeout: WAIT_UNTIL_AVAILABLE_TIMEOUT, timeoutMsg: errorMessage },
    );
  };

module.exports = waitUntilAttributeContains;
