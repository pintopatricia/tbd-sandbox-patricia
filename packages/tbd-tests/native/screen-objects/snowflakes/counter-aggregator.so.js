const {
  COUNTER_AGGREGATOR,
  COUNTER_AGGREGATOR_TITLE,
  COUNTER_AGGREGATOR_SUBTITLE,
} = require("@ppb/tbd-shared/components/MarketBetCard/snowflakes/CounterAggregator/CounterAggregator.native.selectors");

const { ACTION_LINK } = require("@ppb/the-wall-native/components/ActionLink/ActionLink.selectors");
const { COUNTER_VALUE } = require("@ppb/the-wall-native/components/Counter/Counter.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class CounterAggregatorSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${COUNTER_AGGREGATOR}`));
  }

  get counter() {
    return this.element.$(`~${COUNTER_VALUE}`);
  }

  get title() {
    return this.element.$(`~${COUNTER_AGGREGATOR_TITLE}`);
  }

  get subtitle() {
    return this.element.$(`~${COUNTER_AGGREGATOR_SUBTITLE}`);
  }

  get button() {
    return this.element.$(`~${ACTION_LINK}`);
  }
}

module.exports = CounterAggregatorSO;
