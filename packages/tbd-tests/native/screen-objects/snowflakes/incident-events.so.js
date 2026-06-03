const {
  INCIDENT_EVENTS,
  INCIDENT_EVENTS_ROW,
  INCIDENT_EVENTS_HOME,
  INCIDENT_EVENTS_AWAY,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/IncidentEvents/IncidentEvents.native.selectors");

const {
  INCIDENT,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/Incident/Incident.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class IncidentEventsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${INCIDENT_EVENTS}`));
  }

  get incidentEventsRow() {
    return this.element.$$(`~${INCIDENT_EVENTS_ROW}`);
  }

  get incidentEventsHome() {
    return this.element.$$(`~${INCIDENT_EVENTS_HOME}`);
  }

  get incidentEventsAway() {
    return this.element.$$(`~${INCIDENT_EVENTS_AWAY}`);
  }

  get incidents() {
    return this.element.$$(`~${INCIDENT}`);
  }
}

module.exports = IncidentEventsSO;
