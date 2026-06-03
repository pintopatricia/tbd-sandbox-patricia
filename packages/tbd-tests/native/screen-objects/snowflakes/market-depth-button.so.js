const {
  MARKET_DEPTH_BUTTON,
} = require("@ppb/the-wall-native/components/MarketDepthButton/MarketDepthButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class MarketDepthButtonSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MARKET_DEPTH_BUTTON}`));
  }
}

module.exports = MarketDepthButtonSO;
