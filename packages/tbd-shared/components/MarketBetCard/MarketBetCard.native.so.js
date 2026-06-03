const { COUNTER_AGGREGATOR } = require("./snowflakes/CounterAggregator/CounterAggregator.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const {
  MARKET_BET_CARD,
  MARKET_BET_CARD_MARKET_LINK,
  MARKET_BET_CARD_LIABILITY_CONTAINER,
} = require("./MarketBetCard.native.selectors");

module.exports = class MarketBetCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MARKET_BET_CARD}`));
  }

  get marketLink() {
    return this.element.$(`~${MARKET_BET_CARD_MARKET_LINK}`);
  }

  get counterAggregator() {
    return this.element.$(`~${COUNTER_AGGREGATOR}`);
  }

  get liabilityContainer() {
    return this.element.$(`~${MARKET_BET_CARD_LIABILITY_CONTAINER}`);
  }
};
