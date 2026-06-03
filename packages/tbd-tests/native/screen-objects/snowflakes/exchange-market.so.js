const {
  EXCHANGE_MARKET,
  EXCHANGE_MARKET_BLURBS,
} = require("@ppb/tbd-shared/components/ExchangeMarket/snowflakes/ExchangeMarket/ExchangeMarket.native.selectors");
const {
  EXCHANGE_MARKET_RUNNER,
} = require("@ppb/tbd-shared/components/ExchangeMarketRunner/ExchangeMarketRunner.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ExchangeMarketSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${EXCHANGE_MARKET}`));
  }

  get runnerList() {
    return this.element.$$(`~${EXCHANGE_MARKET_RUNNER}`);
  }

  get blurbs() {
    return this.element.$(`~${EXCHANGE_MARKET_BLURBS}`);
  }
}

module.exports = ExchangeMarketSO;
