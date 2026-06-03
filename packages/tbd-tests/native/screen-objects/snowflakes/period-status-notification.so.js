const {
  PERIOD_STATUS_NOTIFICATION,
  PERIOD_STATUS_NOTIFICATION_TITLE,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/PeriodStatusNotification/PeriodStatusNotification.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PeriodStatusNotificationSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PERIOD_STATUS_NOTIFICATION}`));
  }

  get title() {
    return this.element.$(`~${PERIOD_STATUS_NOTIFICATION_TITLE}`);
  }
}

module.exports = PeriodStatusNotificationSO;
