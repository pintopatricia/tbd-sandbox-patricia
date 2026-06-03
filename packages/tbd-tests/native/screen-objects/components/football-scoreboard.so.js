const { TEAM } = require("@ppb/the-wall-native/components/Scoreboard/Team/Team.selectors");
const { TEAMS } = require("@ppb/the-wall-native/components/Scoreboard/Teams/Teams.selectors");

const { CARD_INDICATOR } = require("@ppb/the-wall-native/components/Scoreboard/CardIndicator/CardIndicator.selectors");

const {
  FOOTBALL_SCOREBOARD,
  DATE_TIME,
} = require("@ppb/the-wall-native/components/Scoreboard/FootballScoreboard/FootballScoreboard.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class FootballScoreboardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${FOOTBALL_SCOREBOARD}`));
  }

  get homeTeam() {
    return this.element.$$(`~${TEAM}`)[0];
  }

  get awayTeam() {
    return this.element.$$(`~${TEAM}`)[1];
  }

  /** Used on coupon */
  get teams() {
    return this.element.$(`~${TEAMS}`);
  }

  get dateTime() {
    return this.element.$(`~${DATE_TIME}`);
  }

  get homeRedCards() {
    return this.element.$$(`~${CARD_INDICATOR}`)[0];
  }

  get awayRedCards() {
    return this.element.$$(`~${CARD_INDICATOR}`)[1];
  }
}

module.exports = FootballScoreboardSO;
