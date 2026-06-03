const {
  TEST_ID,
  MARKET_STATUS_INDICATOR,
  LABEL,
} = require("@ppb/the-wall-web/components/bricks/MarketStatus/MarketStatus.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class MarketStatusPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the market status label
   * Uses the `LABEL` selector
   */
  get label() {
    return this.element.$(LABEL);
  }

  /**
   * Returns the market status indicator element
   * Uses the `MARKET_STATUS_INDICATOR` selector
   */
  get indicator() {
    return this.element.$(MARKET_STATUS_INDICATOR);
  }
}

module.exports = MarketStatusPO;
