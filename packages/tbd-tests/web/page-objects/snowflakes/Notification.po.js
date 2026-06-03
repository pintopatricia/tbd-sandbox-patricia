const {
  TEST_ID,
  DESCRIPTION,
  TITLE,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/TimelineNotification/Notification.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class NotificationPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the  notification title
   * @return {HTMLElement} Notification  title
   */
  get notificationTitle() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the notification description
   * @return {HTMLElement} Notification description
   */
  get notificationDescription() {
    return this.element.$(DESCRIPTION);
  }
};
