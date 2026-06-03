const {
  TEAM_LINEUPS_DETAILS,
  TEAM_LINEUPS_PLAYERS,
  TEAM_LINEUPS_PLAYERS_CONTAINER,
  TEAM_LINEUPS_SUBS_CONTAINER,
  TEAM_LINEUPS_SUBS,
  TEAM_LINEUPS_SUBS_TITLE,
  TEAM_LINEUPS_COACHES,
  TEAM_LINEUPS_COACHES_CONTAINER,
  TEAM_LINEUPS_COACHES_TITLE,
  TEAM_LINEUPS_HOME_PLAYER,
  TEAM_LINEUPS_AWAY_PLAYER,
  TEAM_LINEUPS_HOME_MANAGER,
  TEAM_LINEUPS_AWAY_MANAGER,
} = require("@ppb/tbd-components-rich-data/components/StatsLineupsCard/view/snowflakes/FootballTeamLineupsDetails/FootballTeamLineupsDetails.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class FootballTeamLineupsDetailsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEAM_LINEUPS_DETAILS}`));
  }

  get playersSection() {
    return this.element.$(`~${TEAM_LINEUPS_PLAYERS}`);
  }

  get playersRowContainers() {
    return this.element.$$(`~${TEAM_LINEUPS_PLAYERS_CONTAINER}`);
  }

  get substitutesSection() {
    return this.element.$(`~${TEAM_LINEUPS_SUBS_CONTAINER}`);
  }

  get substitutesSubSection() {
    return this.element.$(`~${TEAM_LINEUPS_SUBS}`);
  }

  get substitutesTitle() {
    return this.element.$(`~${TEAM_LINEUPS_SUBS_TITLE}`);
  }

  get coachesSection() {
    return this.element.$(`~${TEAM_LINEUPS_COACHES_CONTAINER}`);
  }

  get coachesTitle() {
    return this.element.$(`~${TEAM_LINEUPS_COACHES_TITLE}`);
  }

  get coachesRowContainer() {
    return this.element.$(`~${TEAM_LINEUPS_COACHES}`);
  }

  get homePlayer() {
    return this.element.$(`~${TEAM_LINEUPS_HOME_PLAYER}`);
  }

  get awayPlayer() {
    return this.element.$(`~${TEAM_LINEUPS_AWAY_PLAYER}`);
  }

  get homeManager() {
    return this.element.$(`~${TEAM_LINEUPS_HOME_MANAGER}`);
  }

  get awayManager() {
    return this.element.$(`~${TEAM_LINEUPS_AWAY_MANAGER}`);
  }
}

module.exports = FootballTeamLineupsDetailsSO;
