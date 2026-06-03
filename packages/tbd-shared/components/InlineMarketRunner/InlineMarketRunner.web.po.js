const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, INLINE_MARKET_RUNNER_HANDICAP } = require("./InlineMarketRunner.web.selectors");

module.exports = class InlineMarketRunnerPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get runnerHandicaps() {
    return this.element.$$(INLINE_MARKET_RUNNER_HANDICAP);
  }
};
