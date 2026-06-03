const {
  CARD_NOTIFICATION,
  CARD_NOTIFICATION_TITLE,
  CARD_NOTIFICATION_DESCRIPTION,
  CARD_NOTIFICATION_CARD_ICON,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/CardNotification/CardNotification.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class CardNotificationSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${CARD_NOTIFICATION}`));
  }

  get cardNotificationTitle() {
    return this.element.$(`~${CARD_NOTIFICATION_TITLE}`);
  }

  get cardNotificationDescription() {
    return this.element.$(`~${CARD_NOTIFICATION_DESCRIPTION}`);
  }

  get cardNotificationIcon() {
    return this.element.$(`~${CARD_NOTIFICATION_CARD_ICON}`);
  }
}

module.exports = CardNotificationSO;
