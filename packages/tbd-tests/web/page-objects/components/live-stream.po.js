const {
  TEST_ID,
  IFRAME_CONTAINERS,
  IFRAME_ELEMENTS,
  PAGINATION,
} = require("@ppb/the-wall-web/components/rooms/LiveStream/LiveStream.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class LiveStreamPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  async swipe(element, directions) {
    const currentLocation = await element.getLocation();
    const elementSize = await element.getSize();
    const currentX = parseInt(currentLocation.x + elementSize.width / 4, 10); // the element width's addition is made in order to touch the sticky live stream in the middle. We divided by 4 because the sticky livestream size is half of its expanded size.
    const currentY = parseInt(currentLocation.y + elementSize.height / 4, 10); // the element height's addition is made in order to touch the sticky live stream in the middle. We divided by 4 because the sticky livestream size is half of its expanded size.
    const target = { x: currentX, y: currentY };
    // Only fetch viewport size once. Unable to do on constructor call
    if (!this.width || !this.height) {
      const { width, height } = await browser.getViewportSize();
      this.width = width - 1;
      this.height = height - 1;
    }
    directions.forEach((direction) => {
      switch (direction) {
        case "RIGHT":
          target.x = this.width;
          break;
        case "LEFT":
          target.x = 0;
          break;
        case "UP":
          target.y = 0;
          break;
        case "DOWN":
          target.y = this.height;
          break;
        default:
          break;
      }
    });
    await this.doSwipe({ x: currentX, y: currentY }, target);
  }

   
  async doSwipe(curent, target) {
    if (!browser.isW3C) {
      await browser.touchDown(curent.x, curent.y);
      await browser.touchMove(target.x, target.y);
      await browser.touchUp(target.x, target.y);
    } else {
      await browser.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "mouse" },
          actions: [
            { type: "pointerMove", x: curent.x, y: curent.y },
            { type: "pointerDown", button: 0 },
            { type: "pause", duration: 10 },
            { type: "pointerMove", x: target.x, y: target.y },
            { type: "pointerUp", button: 0 },
            { type: "pause", duration: 10 },
          ],
        },
      ]);
      await browser.releaseActions();
    }
  }

  /**
   * Gets all Iframe containers
   * @return {HTMLElement[]} IframeContainers
   */
  get iframeContainers() {
    return this.element.$$(IFRAME_CONTAINERS);
  }

  /**
   * Gets all Iframe elements
   * @return {HTMLElement[]} IframeElements
   */
  get iframeElements() {
    return this.element.$$(IFRAME_ELEMENTS);
  }

  /**
   * Gets pagination
   * @return {HTMLElement[]} Pagination
   */
  get pagination() {
    return this.element.$$(PAGINATION);
  }
};
