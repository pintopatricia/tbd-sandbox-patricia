const {
  NOTIFICATION,
  NOTIFICATION_TITLE,
  NOTIFICATION_DESCRIPTION,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/TimelineNotification/Notification.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class NotificationSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${NOTIFICATION}`));
  }

  get notificationTitle() {
    return this.element.$(`~${NOTIFICATION_TITLE}`);
  }

  get notificationDescription() {
    return this.element.$(`~${NOTIFICATION_DESCRIPTION}`);
  }
}

module.exports = NotificationSO;
