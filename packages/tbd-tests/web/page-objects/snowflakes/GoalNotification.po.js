const {
  TEST_ID,
  TITLE,
  DESCRIPTION,
  SECOND_DESCRIPTION,
  IMAGE,
  HOME,
  AWAY,
  GOAL,
  OWN_GOAL,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/GoalNotification/GoalNotification.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class GoalNotificationPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the notification title
   * @return {HTMLElement} GoalNotification title
   */
  get goalNotificationTitle() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the notification description
   * @return {HTMLElement} GoalNotification description
   */
  get goalNotificationDescription() {
    return this.element.$(DESCRIPTION);
  }

  /**
   * Gets the notification second description
   * @return {HTMLElement} GoalNotification second description
   */
  get goalNotificationSecondDescription() {
    return this.element.$(SECOND_DESCRIPTION);
  }

  /**
   * Gets the notification image
   * @return {HTMLElement} GoalNotification image
   */
  get goalNotificationImage() {
    return this.element.$(IMAGE);
  }

  static get states() {
    return {
      HOME: HOME.replace(".", ""),
      AWAY: AWAY.replace(".", ""),
      GOAL: GOAL.replace(".", ""),
      OWN_GOAL: OWN_GOAL.replace(".", ""),
    };
  }
};
