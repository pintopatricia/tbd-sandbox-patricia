const {
  PLAYER,
  PLAYER_NAME,
  PLAYER_NUMBER,
  PLAYER_INCIDENTS_CONTAINER,
  PLAYER_INCIDENT,
} = require("@ppb/tbd-components-rich-data/components/StatsLineupsCard/view/snowflakes/Player/Player.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class PlayerPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(`[data-testid="${PLAYER}"]`));
  }

  /**
   * Gets the player name
   * @return {HTMLElement} Player name
   */
  get playerName() {
    return this.element.$(`[data-testid="${PLAYER_NAME}"]`);
  }

  /**
   * Gets the player number
   * @return {HTMLElement} Player number
   */
  get playerNumber() {
    return this.element.$(`[data-testid="${PLAYER_NUMBER}"]`);
  }

  /**
   * Gets the player incidents
   * @return {HTMLElement} Player incidents list
   */
  get playerIncidents() {
    return this.element.$$(`[data-testid="${PLAYER_INCIDENT}"]`);
  }

  /**
   * Gets the player incidents container
   * @return {HTMLElement} Player incidents container
   */
  get playerIncidentsContainer() {
    return this.element.$(`[data-testid="${PLAYER_INCIDENTS_CONTAINER}"]`);
  }
};
