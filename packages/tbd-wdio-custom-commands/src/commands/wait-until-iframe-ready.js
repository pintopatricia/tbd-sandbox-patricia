const waitUntilIframeReady = (browser) => async (iframe, element) => {
  try {
    await browser.waitUntilInViewport(iframe, "The iframe was not in the viewport");
    await browser.switchToFrame(await iframe.getElement());
    await browser.waitUntilDisplayed(element, "The expected element was not in the iframe");
  } catch (error) {
    // This is here to return to the parent frame in case the iframe takes a long time to load and
    // we get a timeout from the jasmine.DEFAULT_TIMEOUT_INTERVAL (from the `browser.switchToFrame`)
    // so it doesn't break further tests. It also avoids staying inside the iframe and go back to TBD
    // for the remainder of the test if the element is not found inside it.
    await browser.switchToFrame(null);
    throw new Error(error.message);
  }

  return browser.switchToFrame(null);
};

module.exports = waitUntilIframeReady;
