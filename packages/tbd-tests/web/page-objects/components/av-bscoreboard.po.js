const {
  TEST_ID,
  TEAM,
  AVB_TEAM_A_SCORE,
  AVB_TEAM_B_SCORE,
  SCORES,
  MATCH_INFO,
  VIEW_SMALL,
  DATE_TIME,
} = require("@ppb/the-wall-web/components/rooms/AvBScoreboard/AvBScoreboard.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class AvBScoreboardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
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
   * Gets the Team A Score element
   * @return {HTMLElement} Scoreboard team A PO context element
   */
  get teamAScore() {
    return this.element.$(AVB_TEAM_A_SCORE);
  }

  /**
   * Gets the Away Score element
   * @return {HTMLElement} Scoreboard team b PO context element
   */
  get teamBScore() {
    return this.element.$(AVB_TEAM_B_SCORE);
  }

  /**
   * Gets the Scores element
   * @return {HTMLElement} Scores PO context element
   */
  get scores() {
    return this.element.$$(SCORES);
  }

  /**
   * Gets the Match Info element
   * @return {HTMLElement} Match info PO context element
   */
  get matchInfo() {
    return this.element.$(MATCH_INFO);
  }

  /**
   * Gets the Date and Time element
   * @return {HTMLElement} Date and Time PO context element
   */
  get dateTime() {
    return this.element.$(DATE_TIME);
  }

  static get states() {
    return {
      viewSmall: VIEW_SMALL.replace(".", ""),
    };
  }
};
