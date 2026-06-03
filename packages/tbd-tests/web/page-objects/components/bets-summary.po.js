const { TEST_ID } = require("@ppb/the-wall-web/components/bricks/BetsSummary/BetsSummary.selectors");
const {
  LEFT_LABEL,
  LEFT_VALUE_CONTAINER,
  RIGHT_LABEL,
  RIGHT_VALUE_CONTAINER,
  MID_VALUE,
} = require("@ppb/the-wall-web/components/bricks/BetSegments/BetSegments.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BetsSummaryPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  // Receipts -> Total Stake
  // Betslip place footers -> Balance after bet
  get leftSegmentLabel() {
    return this.element.$(LEFT_LABEL);
  }

  // Receipts -> Total Stake
  // Betslip place footers -> Balance after bet
  get leftSegmentValue() {
    return this.element.$(LEFT_VALUE_CONTAINER);
  }

  get totalReturnsLabel() {
    return this.element.$(RIGHT_LABEL);
  }

  get totalReturnsValue() {
    return this.element.$(RIGHT_VALUE_CONTAINER);
  }

  get stakeValue() {
    return this.element.$(MID_VALUE);
  }
}

module.exports = BetsSummaryPO;
