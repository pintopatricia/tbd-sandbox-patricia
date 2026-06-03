const waitUntilCookieEquals =
  (browser, options = { timeout: 8000 }) =>
  (cookie, value, errorMessage = `Cookie ${cookie} does not contain ${value} value`) => {
    const WAIT_UNTIL_COOKIE_EQUALS_TIMEOUT = options.timeout;
    return browser.waitUntil(
      async () => {
        const browserCookies = await browser.getCookies();

        return browserCookies.some((el) => el.name === cookie && el.value === value);
      },
      {
        timeout: WAIT_UNTIL_COOKIE_EQUALS_TIMEOUT,
        timeoutMsg: errorMessage,
      },
    );
  };

module.exports = waitUntilCookieEquals;
