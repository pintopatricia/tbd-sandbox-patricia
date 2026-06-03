const waitUntilBrowserUrlNotContains =
  (browser, options = { timeout: 14000 }) =>
  (urlPart, errorMessage = `Test failed because the browser url contains ${urlPart}`) => {
    const WAIT_UNTIL_BROWSER_URL_NOT_CONTAINS_TIMEOUT = options.timeout;
    return browser.waitUntil(async () => !(await browser.getUrl()).includes(urlPart), {
      timeout: WAIT_UNTIL_BROWSER_URL_NOT_CONTAINS_TIMEOUT,
      timeoutMsg: errorMessage,
    });
  };

module.exports = waitUntilBrowserUrlNotContains;
