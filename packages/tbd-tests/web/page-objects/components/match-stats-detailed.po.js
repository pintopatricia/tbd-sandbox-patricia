const {
  TEST_ID,
  BARSTATS_CONTAINER,
  CARDSTATS_CONTAINER,
  STATS_CONTAINER,
} = require("@ppb/the-wall-web/components/rooms/MatchStats/MatchStats.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class MatchStatsDetailedPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the bar stats container
   * @return {HTMLElement} barStatsContainer
   */
  get barStatsContainer() {
    return this.element.$(BARSTATS_CONTAINER);
  }

  /**
   * Gets the card stats container
   * @return {HTMLElement} cardStatsContainer
   */
  get cardStatsContainer() {
    return this.element.$(CARDSTATS_CONTAINER);
  }

  /**
   * Gets the stats container
   * @return {HTMLElement} statsContainer
   */
  get statsContainer() {
    return this.element.$(STATS_CONTAINER);
  }
};
