const {
  TEAM_NOTIFICATION,
  TEAM_NOTIFICATION_TITLE,
  TEAM_NOTIFICATION_DESCRIPTION,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/TeamNotification/TeamNotification.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class TeamNotificationSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEAM_NOTIFICATION}`));
  }

  get teamNotificationTitle() {
    return this.element.$(`~${TEAM_NOTIFICATION_TITLE}`);
  }

  get teamNotificationDescription() {
    return this.element.$(`~${TEAM_NOTIFICATION_DESCRIPTION}`);
  }
}

module.exports = TeamNotificationSO;
