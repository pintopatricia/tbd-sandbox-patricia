const { TEST_ID, QUICK_STAKE } = require("@ppb/the-wall-web/components/bricks/QuickStakes/QuickStakes.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class QuickStakesPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the quick stake buttons
   * Uses the `QUICK_STAKE` selector
   */
  get quickStake() {
    return this.element.$$(QUICK_STAKE);
  }
}

module.exports = QuickStakesPO;
