const { TEST_ID } = require("@ppb/the-wall-web/components/walls/Dropdown/Dropdown.selectors");
const { TEST_ID: OVERLAY_TEST_ID } = require("@ppb/the-wall-web/components/bricks/Overlay/Overlay.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class DropdownPO extends BasePO {
  /**
   * Creates a Dropdown page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get overlay() {
    return this.element.$(OVERLAY_TEST_ID);
  }
}

module.exports = DropdownPO;
