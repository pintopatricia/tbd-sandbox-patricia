const {
  TEST_ID,
  WRAPPER,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/RewardBenefit/RewardBenefit.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RewardBenefitPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the wrapper of the RewardBenefit element
   * Uses the `WRAPPER` selector
   */
  get wrapper() {
    return this.element.$(WRAPPER);
  }
};
