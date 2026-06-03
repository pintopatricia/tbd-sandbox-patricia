const { TEST_ID, TEAM_A_SCORE, TEAM_B_SCORE } = require("@ppb/the-wall-web/components/bricks/Score/Score.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class ScorePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the team b aggregate score from scoreboard
   * @return {HTMLElement} Scoreboard team a aggregate score
   */
  get teamAScore() {
    return this.element.$(TEAM_A_SCORE);
  }

  /**
   * Gets the team b aggregate score from scoreboard
   * @return {HTMLElement} Scoreboard team b aggregate score
   */
  get teamBScore() {
    return this.element.$(TEAM_B_SCORE);
  }
};
