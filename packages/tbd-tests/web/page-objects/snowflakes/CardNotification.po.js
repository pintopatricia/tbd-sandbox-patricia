const {
  TEST_ID,
  TITLE,
  CARD_ICON,
  DESCRIPTION,
  HOME,
  AWAY,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/CardNotification/CardNotification.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class CardNotificationPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the card title
   * @return {HTMLElement} CardNotification title
   */
  get cardNotificationTitle() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the card icon
   * @return {HTMLElement} CardNotification icon
   */
  get cardNotificationIcon() {
    return this.element.$(CARD_ICON);
  }

  /**
   * Gets the card description
   * @return {HTMLElement} CardNotification description
   */
  get cardNotificationDescription() {
    return this.element.$(DESCRIPTION);
  }

  static get states() {
    return {
      HOME: HOME.replace(".", ""),
      AWAY: AWAY.replace(".", ""),
    };
  }
};
