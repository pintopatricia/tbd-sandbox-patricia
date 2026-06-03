const {
  TEST_ID,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteByMinute/MinuteByMinute.web.selectors");
const {
  TEST_ID: CARD,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/CardNotification/CardNotification.web.selectors");
const {
  TEST_ID: GOAL,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/GoalNotification/GoalNotification.web.selectors");
const {
  TEST_ID: NOTIFICATION,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/TimelineNotification/Notification.web.selectors");
const {
  TEST_ID: SUBSTITUTION,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/SubstitutionNotification/SubstitutionNotification.web.selectors");
const {
  TEST_ID: TEAM,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/TeamNotification/TeamNotification.web.selectors");
const {
  MIDDLE,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/MinuteIncidents.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class MinuteByMinutePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the card notifications list
   * @return {HTMLElement} CardNotification array
   */
  get cardNotifications() {
    return this.element.$$(CARD);
  }

  /**
   * Gets the goal notifications list
   * @return {HTMLElement} GoalNotification array
   */
  get goalNotifications() {
    return this.element.$$(GOAL);
  }

  /**
   * Gets the notifications list
   * @return {HTMLElement} Notification array
   */
  get notifications() {
    return this.element.$$(NOTIFICATION);
  }

  /**
   * Gets the substitution notifications list
   * @return {HTMLElement} SubstitutionNotification array
   */
  get substitutionNotifications() {
    return this.element.$$(SUBSTITUTION);
  }

  /**
   * Gets the team notifications list
   * @return {HTMLElement} TeamNotification array
   */
  get teamNotifications() {
    return this.element.$$(TEAM);
  }

  /**
   * Gets the minutes list
   * @return {HTMLElement} minutes array
   */
  get minutes() {
    return this.element.$$(MIDDLE);
  }
};
