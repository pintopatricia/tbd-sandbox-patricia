const { TEAMS, FIRST_TEAM, SECOND_TEAM } = require("@ppb/the-wall-native/components/Scoreboard/Teams/Teams.selectors");
const { TEAM } = require("@ppb/the-wall-native/components/Scoreboard/Team/Team.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class TeamsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEAMS}`));
  }

  /**
   * @deprecated - use teamA selector instead
   */
  get homeTeam() {
    return this.element.$$(`~${TEAM}`)[0];
  }

  /**
   * @deprecated - use teamB selector instead
   */
  get awayTeam() {
    return this.element.$$(`~${TEAM}`)[1];
  }

  /**
   * @deprecated - use teamA selector instead
   */
  get teamA() {
    return this.element.$$(`~${TEAM}`)[0];
  }

  /**
   * @deprecated - use teamB selector instead
   */
  get teamB() {
    return this.element.$$(`~${TEAM}`)[1];
  }

  get firstTeam() {
    return this.element.$(`~${FIRST_TEAM}`);
  }

  get secondTeam() {
    return this.element.$(`~${SECOND_TEAM}`);
  }
}

module.exports = TeamsSO;
