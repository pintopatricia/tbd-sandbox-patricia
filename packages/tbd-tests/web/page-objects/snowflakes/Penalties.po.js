const {
  TEST_ID,
  HOME_KICKS,
  AWAY_KICKS,
  KICK,
  SCORE,
  GOAL,
  INPLAY,
  MISS,
} = require("@ppb/the-wall-web/components/bricks/Penalties/Penalties.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class PenaltiesPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  static get states() {
    return {
      goal: GOAL.replace(".", ""),
      miss: MISS.replace(".", ""),
      inPlay: INPLAY.replace(".", ""),
    };
  }

  /**
   * Gets the Home Kicks
   * @return {HTMLElement} Scoreboard penalties home kicks
   */
  get homeKicks() {
    return this.element.$(HOME_KICKS);
  }

  /**
   * Gets the Away Kicks
   * @return {HTMLElement} Scoreboard penalties away kicks
   */
  get awayKicks() {
    return this.element.$(AWAY_KICKS);
  }

  /**
   * Gets all penalties kicks (is child of homeKicks or awayKicks)
   * @return {HTMLElement} Scoreboard penalty kick
   */
  get kick() {
    return this.element.$$(KICK);
  }

  /**
   * Gets the penalties score
   * @return {HTMLElement} Penalties score
   */
  get score() {
    return this.element.$(SCORE);
  }
};
