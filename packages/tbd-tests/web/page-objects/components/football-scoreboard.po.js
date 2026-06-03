const {
  TEST_ID,
  TEAM,
  VIEW_COUPON,
  DATE_TIME,
} = require("@ppb/the-wall-web/components/rooms/FootballScoreboard/FootballScoreboard.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class FootballScoreboardPO extends BasePO {
  /**
   * Creates an instance of the FootballScoreboardPO
   * @constructor
   * @param {import("@ppb/wdio-lazy-element").LazyElement} [lazyElement] The selector instance for the container element
   *
   * @example
   * const footballScoreboardPO = new FootballScoreboardPO();
   * const footballScoreboardPO = new FootballScoreboardPO($("selector"));
   */
  constructor(lazyElement) {
    super(lazyElement?.$(TEST_ID), $(TEST_ID));
  }

  static get viewModes() {
    return {
      COUPON: VIEW_COUPON.replace(".", ""),
    };
  }

  /**
   * Gets the Home Team PO's context element
   * @return {HTMLElement} Scoreboard home team PO context element
   */
  get homeTeam() {
    return this.element.$$(TEAM)[0];
  }

  /**
   * Gets the Away Team PO's context element
   * @return {HTMLElement} Scoreboard away team PO context element
   */
  get awayTeam() {
    return this.element.$$(TEAM)[1];
  }

  /**
   * Gets the Date and Time element
   * @return {HTMLElement} Date and Time PO context element
   */
  get dateTime() {
    return this.element.$(DATE_TIME);
  }
};
