const {
  PLAYER,
  PLAYER_CONTAINER,
  PLAYER_NAME,
  PLAYER_NUMBER,
  PLAYER_INCIDENTS_CONTAINER,
  PLAYER_INCIDENT,
  PLAYER_INCIDENT_MINUTES,
  PLAYER_INCIDENT_MINUTE,
} = require("@ppb/tbd-components-rich-data/components/StatsLineupsCard/view/snowflakes/Player/Player.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class FootballLineupPlayerSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PLAYER}`));
  }

  get playerContainer() {
    return this.element.$(`~${PLAYER_CONTAINER}`);
  }

  get playerName() {
    return this.element.$(`~${PLAYER_NAME}`);
  }

  get playerNumber() {
    return this.element.$(`~${PLAYER_NUMBER}`);
  }

  get playerIncidentsContainer() {
    return this.element.$(`~${PLAYER_INCIDENTS_CONTAINER}`);
  }

  get playerIncidents() {
    return this.element.$$(`~${PLAYER_INCIDENT}`);
  }

  get playerMinutesContainer() {
    return this.element.$(`~${PLAYER_INCIDENT_MINUTES}`);
  }

  get playerMinutes() {
    return this.element.$$(`~${PLAYER_INCIDENT_MINUTE}`);
  }
}

module.exports = FootballLineupPlayerSO;
