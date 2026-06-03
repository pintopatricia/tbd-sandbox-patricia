const getCoordsForElement = async (elementId) => {
  const sourceRect = await browser.getElementRect(elementId);
  const sourceX = parseInt(sourceRect.x + sourceRect.width / 2, 10);
  const sourceY = parseInt(sourceRect.y + sourceRect.height / 2, 10);
  return [sourceX, sourceY];
};

const waitUntilStopsMoving =
  (browser, options = { timeout: 8000 }) =>
  async (element, errorMessage = "Element did not stop moving") => {
    const WAIT_UNTIL_TIMEOUT = options.timeout;

    await element.waitForDisplayed();

    let lastCoords;
    const el = await element.getElement();
    const stoppedMoving = async () => {
      if (!lastCoords) {
        lastCoords = await getCoordsForElement(el.elementId);
        return false;
      }

      const coords = await getCoordsForElement(el.elementId);
      const notChanged = coords[0] === lastCoords[0] && coords[1] === lastCoords[1];
      lastCoords = coords;
      return notChanged;
    };

    return browser.waitUntil(stoppedMoving, {
      timeout: WAIT_UNTIL_TIMEOUT,
      timeoutMsg: errorMessage,
    });
  };

module.exports = waitUntilStopsMoving;
