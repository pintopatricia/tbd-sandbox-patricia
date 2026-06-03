const {
  MINUTE_INCIDENTS,
  MINUTE_INCIDENTS_CONTAINER,
  TIME_LABEL,
  EXTRA_TIME_LABEL,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/MinuteIncidents.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class MinuteIncidentsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MINUTE_INCIDENTS}`));
  }

  get minuteIncidentsContainers() {
    return this.element.$$(`~${MINUTE_INCIDENTS_CONTAINER}`);
  }

  get timeLabel() {
    return this.element.$(`~${TIME_LABEL}`);
  }

  get extraTimeLabel() {
    return this.element.$(`~${EXTRA_TIME_LABEL}`);
  }
}

module.exports = MinuteIncidentsSO;
