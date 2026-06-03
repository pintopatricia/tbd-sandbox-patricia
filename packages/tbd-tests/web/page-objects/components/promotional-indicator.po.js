const {
  TEST_ID,
  TEXT,
} = require("@ppb/the-wall-web/components/bricks/PromotionalIndicator/PromotionalIndicator.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PromotionalIndicatorPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the text element
   * Uses the `TEXT` selector
   */
  get text() {
    return this.element.$(TEXT);
  }
}

module.exports = PromotionalIndicatorPO;
