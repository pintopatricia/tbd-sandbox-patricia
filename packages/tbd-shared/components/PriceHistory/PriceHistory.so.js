const { BaseSO } = require("@ppb/wdio-lazy-element");
const { PRICE_HISTORY } = require("./PriceHistory.native.selectors");

class PriceHistorySO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PRICE_HISTORY}`));
  }

  get value() {
    return this.element.$(`~${PRICE_HISTORY}`);
  }
}

module.exports = PriceHistorySO;
