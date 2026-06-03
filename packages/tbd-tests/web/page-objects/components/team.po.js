const {
  TEST_ID,
  NAME,
  CREST,
  DEFAULT_CREST,
  RANK,
} = require("@ppb/the-wall-web/components/bricks/Team/Team.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class TeamPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the crest of a team from the scoreboard
   * @return {HTMLElement} Scoreboard team crest
   */
  get crest() {
    return this.element.$(CREST);
  }

  /**
   * Gets the default team crest (shields) of a team from the scoreboard
   * @return {HTMLElement} Scoreboard default team crest (shields)
   */
  get defaultTeamCrest() {
    return this.element.$(DEFAULT_CREST);
  }

  /**
   * Gets the name of a team from the scoreboard
   * @return {HTMLElement} Scoreboard team name
   */
  get name() {
    return this.element.$(NAME);
  }

  /**
   * Gets the rank of a team from the scoreboard
   * @return {HTMLElement} Scoreboard team name
   */
  get rank() {
    return this.element.$(RANK);
  }
};
