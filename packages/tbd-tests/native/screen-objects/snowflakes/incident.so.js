const {
  INCIDENT,
  INCIDENT_ICON,
  INCIDENT_MINUTE,
  INCIDENT_PLAYER,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/Incident/Incident.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class IncidentSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${INCIDENT}`));
  }

  get incidentIcon() {
    return this.element.$(`~${INCIDENT_ICON}`);
  }

  get incidentMinute() {
    return this.element.$(`~${INCIDENT_MINUTE}`);
  }

  get incidentPlayer() {
    return this.element.$(`~${INCIDENT_PLAYER}`);
  }
}

module.exports = IncidentSO;
