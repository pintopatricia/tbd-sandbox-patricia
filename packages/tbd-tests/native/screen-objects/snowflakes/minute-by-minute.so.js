const {
  MINUTE_BY_MINUTE_CONTAINER,
  MINUTE_BY_MINUTE_SEPARATOR,
  MINUTE_INCIDENTS_CONTAINER,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteByMinute/MinuteByMinute.native.selectors");
const {
  CARD_NOTIFICATION,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/CardNotification/CardNotification.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class MinuteByMinuteSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MINUTE_BY_MINUTE_CONTAINER}`));
  }

  get minuteByMinuteSeparator() {
    return this.element.$(`~${MINUTE_BY_MINUTE_SEPARATOR}`);
  }

  get minuteIncidentsContainer() {
    return this.element.$(`~${MINUTE_INCIDENTS_CONTAINER}`);
  }

  get cardNofitications() {
    return this.element.$$(`~${CARD_NOTIFICATION}`);
  }
}

module.exports = MinuteByMinuteSO;
