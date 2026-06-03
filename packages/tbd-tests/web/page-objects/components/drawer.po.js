const { TEST_ID } = require("@ppb/the-wall-web/components/walls/Drawer/Drawer.selectors");
const { TEST_ID: OVERLAY_TEST_ID } = require("@ppb/the-wall-web/components/bricks/Overlay/Overlay.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class DrawerPO extends BasePO {
  /**
   * Creates a drawer page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get overlay() {
    return this.element.$(OVERLAY_TEST_ID);
  }
}

module.exports = DrawerPO;
