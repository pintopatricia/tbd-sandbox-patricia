const {
  LAST_5_GAMES,
  LAST_5_GAMES_TEAM_INFO,
  LAST_5_GAMES_TEAM_INFO_COMPETITION_STANDINGS,
  RESULT_FORM_ICON_CONTAINER,
} = require("@ppb/tbd-components-rich-data/components/StatsFormCard/view/snowflakes/Last5Games/Last5Games.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class Last5GamesPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(`[data-testid="${LAST_5_GAMES}"]`));
  }

  /**
   * Gets the Last5Games team name
   * @return {HTMLElement} Last5Games teamName
   */
  get teamName() {
    return this.element.$(`[data-testid="${LAST_5_GAMES_TEAM_INFO}"]`);
  }

  /**
   * Gets the Last5Games team competition info
   * @return {HTMLElement} Last5Games competitionInfo
   */
  get competitionInfo() {
    return this.element.$(`[data-testid="${LAST_5_GAMES_TEAM_INFO_COMPETITION_STANDINGS}"]`);
  }

  /**
   * Gets the Last5Games formInfoContainer
   * @return {HTMLElement} Last5Games formInfoContainer
   */
  get formContainer() {
    return this.element.$(`[data-testid="${RESULT_FORM_ICON_CONTAINER}"]`);
  }
};
