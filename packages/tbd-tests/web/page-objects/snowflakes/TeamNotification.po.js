const {
  TEST_ID,
  DESCRIPTION,
  TITLE,
  HOME,
  AWAY,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/TeamNotification/TeamNotification.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class TeamNotificationPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the team notification title
   * @return {HTMLElement} TeamNotification title
   */
  get teamNotificationTitle() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the team notification description
   * @return {HTMLElement} TeamNotification description
   */
  get teamNotificationDescription() {
    return this.element.$(DESCRIPTION);
  }

  static get states() {
    return {
      HOME: HOME.replace(".", ""),
      AWAY: AWAY.replace(".", ""),
    };
  }
};
