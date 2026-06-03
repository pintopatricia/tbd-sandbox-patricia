const { BaseSO } = require("@ppb/wdio-lazy-element");
const { INLINE_MARKET_RUNNER, INLINE_MARKET_RUNNER_HANDICAP } = require("./InlineMarketRunner.native.selectors");

class InlineMarketRunnerSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${INLINE_MARKET_RUNNER}`));
  }

  get runnerHandicaps() {
    return this.element.$$(`~${INLINE_MARKET_RUNNER_HANDICAP}`);
  }
}

module.exports = InlineMarketRunnerSO;
