const {
  MARKET_STATUS,
  MARKET_STATUS_INDICATOR,
  MARKET_STATUS_LABEL,
} = require("@ppb/the-wall-native/components/MarketStatus/MarketStatus.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class MarketStatusSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MARKET_STATUS}`));
  }

  /**
   * Returns the market status label
   * Uses the `LABEL` selector
   */
  get label() {
    return this.element.$(`~${MARKET_STATUS_LABEL}`);
  }

  /**
   * Returns the market status indicator element
   * Uses the `MARKET_STATUS_INDICATOR` selector
   */
  get indicator() {
    return this.element.$(`~${MARKET_STATUS_INDICATOR}`);
  }
}

module.exports = MarketStatusSO;
