const { BaseSO } = require("@ppb/wdio-lazy-element");
const { MARKET } = require("./Market.native.selectors");

class MarketSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MARKET}`));
  }
}

module.exports = MarketSO;
