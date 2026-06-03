const {
  TEST_ID,
  SPEND_STATUS,
  HOME_PROGRESS_BAR,
  AWAY_PROGRESS_BAR,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/BudgetStats/BudgetStats.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class BudgetStatsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the spend budget amount
   * @return {HTMLElement} spend budget amount status
   */
  get spendBudget() {
    return this.element.$(SPEND_STATUS);
  }

  /**
   * Gets the spend budget amount
   * @return {HTMLElement} spend budget amount (the colored part of progress bar)
   */
  get spentBudgetProgressBar() {
    return this.element.$(HOME_PROGRESS_BAR);
  }

  /**
   * Gets the spend budget amount
   * @return {HTMLElement} the remaining amount that can be spend (the empty part of progress bar)
   */
  get remainingBudgetProgressBar() {
    return this.element.$(AWAY_PROGRESS_BAR);
  }
};
