const {
  TEST_ID,
  MONTH_REWARDS,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/RewardStats/RewardsStats.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RewardsStatsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the month rewards
   * @return {HTMLElement} rewards per month
   */
  get monthRewards() {
    return this.element.$(MONTH_REWARDS);
  }
};
