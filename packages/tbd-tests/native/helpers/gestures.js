/**
 * The values in the below object are percentages of the screen
 */
const SWIPE_DIRECTION = {
  down: {
    start: { x: 50, y: 15 },
    end: { x: 50, y: 85 },
  },
  left: {
    start: { x: 95, y: 50 },
    end: { x: 5, y: 50 },
  },
  right: {
    start: { x: 5, y: 50 },
    end: { x: 95, y: 50 },
  },
  up: {
    start: { x: 50, y: 85 },
    end: { x: 50, y: 15 },
  },
};

const HORIZONTAL = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

const VERTICAL = {
  UP: "UP",
  BOTTOM: "BOTTOM",
};

const CORNER_DELTA = 0.2;

/**
 * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are in pixels.
 *
 * @param {object} from { x: 50, y: 50 }
 * @param {object} to { x: 25, y: 25 }
 */
async function swipe(from, to) {
  await driver.performActions([
    {
      action: "release",
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: from.x, y: from.y },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 1000 },
        { type: "pointerMove", duration: 500, x: to.x, y: to.y },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);
  await driver.releaseActions(); // optional depending on driver
}

/**
 * Get the screen coordinates based on a device his screensize
 *
 * @param {number} screenSize the size of the screen
 * @param {object} coordinates like { x: 50, y: 50 }
 *
 * @return {{x: number, y: number}}
 */
function getDeviceScreenCoordinates(screenSize, coordinates) {
  return {
    x: Math.round(screenSize.width * (coordinates.x / 100)),
    y: Math.round(screenSize.height * (coordinates.y / 100)),
  };
}

/**
 * Calculate the x y coordinates based on a percentage
 *
 * @param {object} coordinates
 * @param {number} percentage
 *
 * @return {{x: number, y: number}}
 */
function calculateXY({ x, y }, percentage) {
  return {
    x: x * percentage,
    y: y * percentage,
  };
}

async function swipeElement(element, xDistance = 0, yDistance = 0, horizontal = null, vertical = null) {
  const windowSize = await browser.getWindowSize();
  const location = await element.getLocation();
  const size = await element.getSize();
  // eslint-disable-next-line no-nested-ternary
  const horizontalFactor = horizontal ? (horizontal === HORIZONTAL.LEFT ? CORNER_DELTA : 1 - CORNER_DELTA) : 0.5;
  // eslint-disable-next-line no-nested-ternary
  const verticalFactor = vertical ? (vertical === VERTICAL.UP ? CORNER_DELTA : 1 - CORNER_DELTA) : 0.5;
  const from = {
    x: location.x + size.width * horizontalFactor,
    y: location.y + size.height * verticalFactor,
  };
  const to = {
    x: Math.min(windowSize.width - 1, from.x + xDistance),
    y: Math.min(windowSize.height - 1, from.y + yDistance),
  };

  return swipe(from, to);
}

async function getSwipeCoordinatesBetweenElements(element, secondElement, horizontal = null, vertical = null) {
  const location = await element.getLocation();
  const size = await element.getSize();

  const secondLocation = await secondElement.getLocation();
  const secondSize = await secondElement.getSize();
  // eslint-disable-next-line no-nested-ternary
  const horizontalFactor = horizontal ? (horizontal === HORIZONTAL.LEFT ? CORNER_DELTA : 1 - CORNER_DELTA) : 0.5;
  // eslint-disable-next-line no-nested-ternary
  const verticalFactor = vertical ? (vertical === VERTICAL.UP ? CORNER_DELTA : 1 - CORNER_DELTA) : 0.5;
  const from = {
    x: location.x + size.width * horizontalFactor,
    y: location.y + size.height * verticalFactor,
  };
  const to = {
    x: secondLocation.x + secondSize.width * horizontalFactor,
    y: secondLocation.y + secondSize.height * verticalFactor,
  };

  return { from, to };
}

async function swipeFromElementToElement(element, secondElement, horizontal, vertical) {
  const { from, to } = await getSwipeCoordinatesBetweenElements(element, secondElement, horizontal, vertical);

  return swipe(from, to);
}

async function getVerticalDistanceBetweenTwoElements(firstElement, secondElement) {
  const { from, to } = await getSwipeCoordinatesBetweenElements(firstElement, secondElement);

  return from.y - to.y;
}

async function swipeUpElement(element, distance = 500) {
  return swipeElement(element, 0, distance * -1);
}

async function swipeDownElement(element, distance = 500) {
  return swipeElement(element, 0, distance);
}

async function swipeLeftElement(element, distance = 500) {
  return swipeElement(element, distance * -1, 0);
}

async function swipeRightElement(element, distance = 500) {
  return swipeElement(element, distance, 0);
}

async function swipeUpElementFullscreen(element) {
  const elementLocationY = await element.getLocation("y");

  return swipeElement(element, 0, elementLocationY * -1);
}

async function swipeDownElementFullscreen(element) {
  const windowSize = await browser.getWindowSize();
  const elementLocationY = await element.getLocation("y");

  return swipeElement(element, 0, windowSize.height - elementLocationY);
}

/**
 * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are
 * percentages of the screen.
 *
 * @param {object} from { x: 50, y: 50 }
 * @param {object} to { x: 25, y: 25 }
 */
async function swipeOnPercentage(from, to) {
  const screenSize = await driver.getWindowRect();
  const pressOptions = getDeviceScreenCoordinates(screenSize, from);
  const moveToScreenCoordinates = getDeviceScreenCoordinates(screenSize, to);

  return swipe(pressOptions, moveToScreenCoordinates);
}

/**
 * Swipe down based on a percentage
 *
 * @param {number} percentage from 0 - 1
 */
async function swipeDown(percentage = 1) {
  return swipeOnPercentage(
    calculateXY(SWIPE_DIRECTION.down.start, percentage),
    calculateXY(SWIPE_DIRECTION.down.end, percentage),
  );
}

/**
 * Swipe Up based on a percentage
 *
 * @param {number} percentage from 0 - 1
 */
async function swipeUp(percentage = 1) {
  return swipeOnPercentage(
    calculateXY(SWIPE_DIRECTION.up.start, percentage),
    calculateXY(SWIPE_DIRECTION.up.end, percentage),
  );
}

/**
 * Swipe left based on a percentage
 *
 * @param {number} percentage from 0 - 1
 */
async function swipeLeft(percentage = 1) {
  return swipeOnPercentage(
    calculateXY(SWIPE_DIRECTION.left.start, percentage),
    calculateXY(SWIPE_DIRECTION.left.end, percentage),
  );
}

/**
 * Swipe right based on a percentage
 *
 * @param {number} percentage from 0 - 1
 */
async function swipeRight(percentage = 1) {
  return swipeOnPercentage(
    calculateXY(SWIPE_DIRECTION.right.start, percentage),
    calculateXY(SWIPE_DIRECTION.right.end, percentage),
  );
}

/**
 * Swipes to bottom of the screen (until no more BFF content is loaded)
 */
const swipeToBottom = async (percentage) => {
  let actualPageSource;
  let updatedPageSource;

  do {
    /* eslint-disable no-await-in-loop */
    actualPageSource = await driver.getPageSource();
    await swipeUp(percentage);

    // eslint-disable-next-line no-restricted-syntax
    await browser.pause(1000); // force wait for scrollBar to hide again

    updatedPageSource = await driver.getPageSource();
    /* eslint-enable no-await-in-loop */
  } while (actualPageSource !== updatedPageSource);
};

async function hideKeyboard() {
  try {
    await browser.waitUntil(() => driver.isKeyboardShown(), {
      timeout: 2000,
      timeoutMsg: "Keyboard is not open to hide it",
    });
  } catch (e) {
    if (await driver.isKeyboardShown()) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  // Seems like sometimes the keyboard remains open when previous tap execution happens.
  // Instead of tapping, let's try to dismiss it programatically.
  if (driver.isIOS) {
    await browser.sendKeys(["\n"]);
  } else {
    await driver.longPressKeyCode(66); // Keycode for ENTER
  }
}

export const DIRECTIONS = {
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
};

/**
 * Check if an element is visible and if not wipe up a portion of the screen to
 * check if it visible after x amount of scrolls
 * Inspired by: https://github.com/webdriverio/appium-boilerplate/blob/e3dfbc0ba59a4c2f29c93bd0d3509bd8e1568b70/tests/helpers/Gestures.ts#L43
 */
async function checkIfDisplayedWithSwipe({
  scrollContainer,
  searchableElement,
  maxScrolls = 20,
  amount = 0,
  direction = VERTICAL.BOTTOM,
  // Never scroll from the exact top or bottom of the screen, you might trigger the notification bar or other OS/App features
  percentage = 0.99,
}) {
  // If the element is not displayed and we haven't scrolled the max amount of scrolls
  // then scroll and execute the method again
  if (!(await searchableElement.isDisplayed()) && amount <= maxScrolls) {
    // 1. Determine the percentage of the scrollable container to be scrolled
    // The scroll percentage is the percentage of the scrollable container that should be scrolled
    let scrollPercentage;
    if (Number.isNaN(percentage)) {
      // eslint-disable-next-line no-console
      console.error("\nThe percentage to scroll should be a number.\n");
      // Never scroll from the exact top or bottom of the screen, you might trigger the notification bar or other OS/App features
      scrollPercentage = 0.99;
    } else if (percentage > 1) {
      // eslint-disable-next-line no-console
      console.error("\nThe percentage to scroll should be a number between 0 and 1.\n");
      // Never scroll from the exact top or bottom of the screen, you might trigger the notification bar or other OS/App features
      scrollPercentage = 0.99;
    } else {
      scrollPercentage = 1 - percentage;
    }

    // 2. Determine the swipe coordinates
    //    When we get the element rect we get the position of the element on the screen based on the
    //    - x (position from the left of the screen)
    //    - y (position from the top of the screen)
    //    - width (width of the element)
    //    - height (height of the element)
    //    We can use this to calculate the position of the swipe by determining the
    //    - top
    //    - right
    //    - bottom
    //    - left
    //    of the element. These positions will contain the x and y coordinates on where to put the finger
    const scrollElement = await scrollContainer.getElement();

    const { x, y, width, height } = await driver.getElementRect(scrollElement.elementId);

    // It's always advisable to swipe from the center of the element.
    const scrollRectangles = {
      // The x is the center of the element,
      // The y is the y of the element + the height of the element * the scroll percentage
      top: { x: Math.round(x + width / 2), y: Math.round(y + height * scrollPercentage) },
      // The x is the x of the element + the width of the element, minus the width of the element * the scroll percentage
      // The y is the center of the element,
      right: { x: Math.round(x + width - width * scrollPercentage), y: Math.round(y + height / 2) },
      // The x is the center of the element,
      // The y is the y of the element, plus the height, minus the height of the element * the scroll percentage
      bottom: { x: Math.round(x + width / 2), y: Math.round(y + height - height * scrollPercentage) },
      // The x is the x of the element, plus the width of the element * the scroll percentage
      // The y is the center of the element,
      left: { x: Math.round(x + width * scrollPercentage), y: Math.round(y + height / 2) },
    };

    // 3. Swipe in the given direction
    if (direction === VERTICAL.BOTTOM) {
      await swipe(scrollRectangles.top, scrollRectangles.bottom);
    } else if (direction === HORIZONTAL.LEFT) {
      await swipe(scrollRectangles.right, scrollRectangles.left);
    } else if (direction === HORIZONTAL.RIGHT) {
      await swipe(scrollRectangles.left, scrollRectangles.right);
    } else if (direction === VERTICAL.UP) {
      await swipe(scrollRectangles.bottom, scrollRectangles.top);
    } else {
      // eslint-disable-next-line no-console
      console.error("\nThe direction to scroll should be one of the following: down, left, right or up.\n");
    }

    // 4. Check if the element is visible or swipe again
    await checkIfDisplayedWithSwipe({
      scrollContainer,
      searchableElement,
      maxScrolls,
      amount: amount + 1,
      direction,
      percentage,
    });
  } else if (amount > maxScrolls) {
    // If the element is still not visible after the max amount of scroll let it fail
    throw new Error(`The element '${searchableElement}' could not be found or is not visible.`);
  }

  // The element was found, proceed with the next action
}

async function longPress(element) {
  const { x, y } = await element.getLocation();
  const { width, height } = await element.getSize();

  await driver.performActions([
    {
      action: "release",
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: x + width / 2, y: y + height / 2 },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 2000 },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);

  await driver.releaseActions(); // optional depending on driver
}

async function touch(x, y) {
  await driver.performActions([
    {
      action: "release",
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x, y },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 500 },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);

  await driver.releaseActions(); // optional depending on driver
}

module.exports = {
  HORIZONTAL,
  VERTICAL,
  swipeElement,
  swipeDownElement,
  swipeDownElementFullscreen,
  swipeUpElement,
  swipeUpElementFullscreen,
  swipeLeftElement,
  swipeRightElement,
  swipeDown,
  swipeUp,
  swipeLeft,
  swipeRight,
  swipe,
  swipeFromElementToElement,
  swipeToBottom,
  getVerticalDistanceBetweenTwoElements,
  hideKeyboard,
  checkIfDisplayedWithSwipe,
  longPress,
  touch,
};
