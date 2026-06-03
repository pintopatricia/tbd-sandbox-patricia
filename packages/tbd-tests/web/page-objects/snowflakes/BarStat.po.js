const {
  TEST_ID,
  STAT_HOME_VALUE,
  STAT_AWAY_VALUE,
  LABEL,
} = require("@ppb/the-wall-web/components/walls/BarStat/BarStat.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class FootballMatchStatisticPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
  /**
   * Gets the home team statistics value
   * @return {HTMLElement} Home Team Statistics Value
   */

  get statisticsHome() {
    return this.element.$(STAT_HOME_VALUE);
  }
  /**
   * Gets the away team statistics value
   * @return {HTMLElement} Away Team Statistics Value
   */

  get statisticsAway() {
    return this.element.$(STAT_AWAY_VALUE);
  }
  /**
   * Gets the statistics label
   * @return {HTMLElement} Statistics Label
   */

  get getLabel() {
    return this.element.$(LABEL);
  }
};
