const {
  GOAL_NOTIFICATION,
  GOAL_NOTIFICATION_TITLE,
  GOAL_NOTIFICATION_DESCRIPTION,
  GOAL_NOTIFICATION_SECOND_DESCRIPTION,
  GOAL_NOTIFICATION_ICON,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/GoalNotification/GoalNotification.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class GoalNotificationSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${GOAL_NOTIFICATION}`));
  }

  get goalNotificationTitle() {
    return this.element.$(`~${GOAL_NOTIFICATION_TITLE}`);
  }

  get goalNotificationDescription() {
    return this.element.$(`~${GOAL_NOTIFICATION_DESCRIPTION}`);
  }

  get goalNotificationSecondDescription() {
    return this.element.$(`~${GOAL_NOTIFICATION_SECOND_DESCRIPTION}`);
  }

  get goalNotificationIcon() {
    return this.element.$(`~${GOAL_NOTIFICATION_ICON}`);
  }
}

module.exports = GoalNotificationSO;
