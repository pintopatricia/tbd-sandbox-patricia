const {
  TEST_ID,
  RESULT,
  HOME_TEAM_RESULTS,
  AWAY_TEAM_RESULTS,
} = require("@ppb/tbd-shared/components/RecentFormCard/snowflakes/RecentFormDetailed/RecentFormDetailed.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RecentFormDetailedPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets all recent results
   * @return {HTMLElement} RecentFormResult all results
   */
  get results() {
    return this.element.$$(RESULT);
  }

  /**
   * Gets home team results
   * @return {HTMLElement} RecentFormResult home team results
   */
  get homeTeamResults() {
    return this.element.$$(HOME_TEAM_RESULTS);
  }

  /**
   * Gets away team results
   * @return {HTMLElement} RecentFormResult away team results
   */
  get awayTeamResults() {
    return this.element.$$(AWAY_TEAM_RESULTS);
  }
};
