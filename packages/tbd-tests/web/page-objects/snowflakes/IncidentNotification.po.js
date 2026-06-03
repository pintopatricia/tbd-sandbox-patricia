const {
  TEST_ID,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/IncidentNotification/IncidentNotification.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class IncidentNotificationPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
};
