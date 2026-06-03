const {
  TEST_ID,
  TITLE,
  DESCRIPTION,
  PROGRESS_BAR,
  LABEL,
} = require("@ppb/tbd-shared/components/GamingJackpotCard/snowflakes/Jackpot/Jackpot.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class JackpotPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the jackpot title
   * @return {HTMLElement} Jackpot Title
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the Jackpot description
   * @return {HTMLElement} Jackpot Description
   */
  get description() {
    return this.element.$(DESCRIPTION);
  }

  /**
   * Gets the Jackpot Progress Bar
   * @return {HTMLElement} Jackpot Progress Bar
   */
  get progressBar() {
    return this.element.$(PROGRESS_BAR);
  }

  /**
   * Gets the Jackpot label (the one on the badge)
   * @return {HTMLElement} Gets the Jackpot label (the one on the badge)
   */
  get label() {
    return this.element.$(LABEL);
  }
};
