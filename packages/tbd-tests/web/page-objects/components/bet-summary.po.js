const { TEST_ID, TITLE, STAKE_VALUE } = require("@ppb/the-wall-web/components/rooms/BetSummary/BetSummary.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BetSummaryPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get stakeValue() {
    return this.element.$$(STAKE_VALUE);
  }
}

module.exports = BetSummaryPO;
