const {
  TEST_ID,
  TITLE,
  STAT_AWAY,
  STAT_HOME,
  ICON,
} = require("@ppb/the-wall-web/components/bricks/CardStat/CardStat.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class CardStatPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the card stat title
   * @return {HTMLElement} Card stat title
   */
  get cardTitle() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the card stat icon
   * @return {HTMLElement} Card stat icon
   */
  get cardIcon() {
    return this.element.$(ICON);
  }

  /**
   * Gets the card home stats
   * @return {HTMLElement} Card card home stats
   */
  get cardAwayStats() {
    return this.element.$(STAT_AWAY);
  }

  /**
   * Gets the card home stats
   * @return {HTMLElement} Card card home stats
   */
  get cardHomeStats() {
    return this.element.$(STAT_HOME);
  }
};
