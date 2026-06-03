const {
  TEST_ID,
  AGGREGATE_SCORE,
  PREPLAY_FIRST_LEG,
  VERSUS,
} = require("@ppb/the-wall-web/components/walls/FootballScore/FootballScore.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class FootballScorePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the main score from scoreboard
   * @return {HTMLElement} Scoreboard main score
   */
  get aggregateScore() {
    return this.element.$(AGGREGATE_SCORE);
  }

  /**
   * Gets the first leg score from scoreboard, only available on preplay
   * @returns {HTMLElement} Scoreboard preplay first leg score
   */
  get preplayFirstLeg() {
    return this.element.$(PREPLAY_FIRST_LEG);
  }

  /**
   * Gets the versus element (Available on NOT_STARTED and PREPLAY status - if first leg score is null)
   * @return {HTMLElement} Scoreboard versus
   */
  get versus() {
    return this.element.$(VERSUS);
  }
};
