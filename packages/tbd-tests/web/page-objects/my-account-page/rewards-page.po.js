const { BasePO } = require("@ppb/wdio-lazy-element");

const {
  TEST_ID,
  BASIC_PLAN_TITLE,
  CURRENT_MONTH_SECTION,
  CURRENT_MONTH_SECTION_MONTH,
  CURRENT_MONTH_SECTION_PROGRESS_MESSAGE,
  NEXT_MONTH_SECTION,
  NEXT_MONTH_SECTION_LINK,
  NEXT_MONTH_SECTION_MONTH,
  NEXT_MONTH_SECTION_COUNTER,
  NEXT_MONTH_SECTION_PROGRESS_BAR,
  NEXT_MONTH_SECTION_PROGRESS_BAR_BETS_NUMBER,
  NEXT_MONTH_SECTION_PROGRESS_MESSAGE,
  CHOSEN_PLAN_TITLE,
  TITLE_CONTAINER,
  REWARDS_SWIMLANE,
  REWARD_CARD_TITLE,
  REWARD_CARD_BENEFIT_LIST,
} = require("./rewards-page.selectors");

class RewardsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the entire rewards container
   * @return {HTMLElement} The rewards page container
   */
  get rewardsContainer() {
    return this.element.$(TEST_ID);
  }

  /**
   * Gets the entire rewards container title
   * @return {HTMLElement} The rewards page container title
   */
  get containerTitle() {
    return this.element.$(TITLE_CONTAINER);
  }

  /**
   * Gets the user's chosen reward plan title
   * @return {HTMLElement} The user's chosen reward plan title
   */
  get chosenPlanContainerTitle() {
    return this.element.$(CHOSEN_PLAN_TITLE);
  }

  /**
   * Gets the scrollable swimlane
   * @return {HTMLElement} The scrollable swimlane
   */
  get scrollableRewardsSwimlane() {
    return this.element.$(REWARDS_SWIMLANE);
  }

  /**
   * Gets the user's next month section for the opted in plan: should contain a link, month, counter, progress bar and message
   * @return {HTMLElement} The user's next month section for the opted in plan
   */
  get nextMonthSection() {
    return this.element.$(NEXT_MONTH_SECTION);
  }

  /**
   * Gets the user's next month section link; see nextMonthSection
   * @return {HTMLElement} The user's next month section link
   */
  get nextMonthSectionLink() {
    return this.element.$(NEXT_MONTH_SECTION_LINK);
  }

  /**
   * Gets the user's next month section month; see nextMonthSection
   * @return {HTMLElement} The user's next month section month
   */
  get nextMonthSectionMonth() {
    return this.element.$(NEXT_MONTH_SECTION_MONTH);
  }

  /**
   * Gets the user's next month progress message link; see nextMonthSection
   * @return {HTMLElement} The user's next month progress message
   */
  get nextMonthSectionProgressMessage() {
    return this.element.$(NEXT_MONTH_SECTION_PROGRESS_MESSAGE);
  }

  /**
   * Gets the user's next month progress bar; see nextMonthSection
   * @return {HTMLElement} The user's next month progress bar
   */
  get nextMonthSectionProgressBar() {
    return this.element.$(NEXT_MONTH_SECTION_PROGRESS_BAR);
  }

  /**
   * Gets the user's next month progress bar current bet no; see nextMonthSection
   * @return {HTMLElement} The user's next month progress bar
   */
  get nextMonthSectionProgressBarBetsNumber() {
    return this.element.$(NEXT_MONTH_SECTION_PROGRESS_BAR_BETS_NUMBER);
  }

  /**
   * Gets the user's next month section counter: settled vs required bets
   * @return {HTMLElement} The user's next month section counter: settled vs required bets
   */
  get nextMonthSectionCounter() {
    return this.element.$(NEXT_MONTH_SECTION_COUNTER);
  }

  /**
   * Gets the user's current month result section: the month, a message that reflects if the required bets were fulfilled
   * @return {HTMLElement} The user's current month, a message that reflects if the required bets were fulfilled
   */
  get currentMonthResultSection() {
    return this.element.$(CURRENT_MONTH_SECTION);
  }

  /**
   * Gets the user's current month; see currentMonthResultSection
   * @return {HTMLElement} The user's current month; see currentMonthResultSection
   */
  get currentMonthSectionMonth() {
    return this.element.$(CURRENT_MONTH_SECTION_MONTH);
  }

  /**
   * Gets the user's current month progress message; see currentMonthResultSection
   * @return {HTMLElement} The user's current progress month; see currentMonthResultSection
   */
  get currentMonthSectionProgressMessage() {
    return this.element.$(CURRENT_MONTH_SECTION_PROGRESS_MESSAGE);
  }

  /**
   * Gets the user's basic plan title
   * @return {HTMLElement} The user's basic plan title
   */
  get basicPlanTitle() {
    return this.element.$(BASIC_PLAN_TITLE);
  }

  /**
   * Gets the name of the reward plan: Rewards+, Reward or Basic
   * @returns {LazyElement}
   */
  get scrollableRewardCardTitle() {
    return this.element.$(REWARD_CARD_TITLE);
  }

  /**
   * Returns a list of the benefits specified on the current rewards card.
   * @returns {LazyElementGroup}
   */
  get rewardBenefitList() {
    return this.element.$$(REWARD_CARD_BENEFIT_LIST);
  }
}
module.exports = RewardsPO;
