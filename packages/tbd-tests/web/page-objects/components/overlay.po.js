const { TEST_ID, USER_PROFILE_IFRAME } = require("@ppb/the-wall-web/components/bricks/Overlay/Overlay.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class OverlayPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the user profile iframe
   * @returns {LazyElementGroup}
   */
  get profileIframe() {
    return this.element.$(USER_PROFILE_IFRAME);
  }
}

module.exports = OverlayPO;
