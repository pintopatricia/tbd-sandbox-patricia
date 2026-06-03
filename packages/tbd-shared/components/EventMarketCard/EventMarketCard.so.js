const { BaseSO } = require("@ppb/wdio-lazy-element");

const {
  EVENT_MARKET_CARD,
  EVENT_MARKET_CARD_HEADER,
  EVENT_MARKET_CARD_CONTAINER,
} = require("./EventMarketCard.native.selectors");

class EventMarketCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(EVENT_MARKET_CARD));
  }

  get header() {
    return this.element.$(EVENT_MARKET_CARD_HEADER);
  }

  get container() {
    return this.element.$(EVENT_MARKET_CARD_CONTAINER);
  }
}

module.exports = EventMarketCardSO;
