const {
  INCIDENT_NOTIFICATION,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/IncidentNotification/IncidentNotification.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class IncidentNotificationSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${INCIDENT_NOTIFICATION}`));
  }
}

module.exports = IncidentNotificationSO;
