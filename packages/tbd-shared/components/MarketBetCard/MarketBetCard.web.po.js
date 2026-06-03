const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, COUNTER_AGGREGATOR, LIABILITY_CONTAINER } = require("./MarketBetCard.web.selectors");

module.exports = class MarketBetCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get counterAggregator() {
    return this.element.$(COUNTER_AGGREGATOR);
  }

  get liabilityContainer() {
    return this.element.$(LIABILITY_CONTAINER);
  }
};
