const {
  TEST_ID,
  REWARDS_MESSAGE,
  MESSAGE_VALUE,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/Rewards/Rewards.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RewardsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the month rewards message
   * @return {HTMLElement} rewards message for current month
   */
  get monthRewards() {
    return this.element.$(REWARDS_MESSAGE);
  }

  /**
   * Gets computed message value or type
   * @return {HTMLElement} rewards message value or type
   */
  get rewardsMessageValue() {
    return this.element.$(MESSAGE_VALUE);
  }
};
