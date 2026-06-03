const {
  TEST_ID,
  INCIDENT_MINUTE,
  INCIDENT_PLAYER,
  INCIDENT_ICON,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/Incident/Incident.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class IncidentPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the incident player
   * @return {HTMLElement} incident player
   */
  get getIncidentPlayer() {
    return this.element.$(INCIDENT_PLAYER);
  }

  /**
   * Gets the incident minute
   * @return {HTMLElement} incident minute
   */
  get getIncidentMinute() {
    return this.element.$(INCIDENT_MINUTE);
  }

  /**
   * Gets the incident icon
   * @return {HTMLElement} incident icon
   */
  get getIncidentIcon() {
    return this.element.$(INCIDENT_ICON);
  }
};
