const {
  TEST_ID,
  RESET_MESSAGE,
  BUDGET_LINK,
  LINK,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/Budget/Budget.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class BudgetPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the reset message
   * @return {HTMLElement} reset time message for the budget spent status
   */
  get resetMessage() {
    return this.element.$(RESET_MESSAGE);
  }

  /**
   * Gets the direct link to My Spent Budget hub
   * @return {HTMLElement} redirect label to My Spent Budget hub
   */
  get budgetLink() {
    return this.element.$(BUDGET_LINK);
  }

  /**
   * Gets the direct link to My Spent Budget hub
   * @return {HTMLElement} redirect link to My Spent Budget hub
   */
  get budgetLinkRedirect() {
    return this.element.$(LINK);
  }
};
