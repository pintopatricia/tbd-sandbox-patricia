const {
  TEST_ID,
  STAT_HOME_BAR,
  STAT_AWAY_BAR,
} = require("@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class ProgressBarPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the home team bar visuals
   * @return {HTMLElement} Home Team Bar Visuals
   */

  get getHomeBar() {
    return this.element.$(STAT_HOME_BAR);
  }

  /**
   * Gets the away team bar visuals
   * @return {HTMLElement} Away Team Bar Visuals
   */

  get getAwayBar() {
    return this.element.$(STAT_AWAY_BAR);
  }
};
