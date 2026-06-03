const { TEST_ID: COUNTER } = require("@ppb/the-wall-web/components/bricks/Counter/Counter.selectors");
const {
  TEST_ID,
  TITLE,
  SUBTITLE,
  BUTTON,
} = require("@ppb/tbd-shared/components/MarketBetCard/snowflakes/CounterAggregator/CounterAggregator.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class CounterAggregatorPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get counter() {
    return this.element.$(COUNTER);
  }

  get title() {
    return this.element.$(TITLE);
  }

  get subtitle() {
    return this.element.$(SUBTITLE);
  }

  get button() {
    return this.element.$(BUTTON);
  }
}

module.exports = CounterAggregatorPO;
