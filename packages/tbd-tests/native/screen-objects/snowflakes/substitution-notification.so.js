const {
  SUBSTITUTION_NOTIFICATION,
  SUBSTITUTION_NOTIFICATION_TITLE,
  SUBSTITUTION_NOTIFICATION_PLAYER_IN_ENTRY,
  SUBSTITUTION_NOTIFICATION_PLAYER_IN_ICON,
  SUBSTITUTION_NOTIFICATION_PLAYER_IN_TEXT,
  SUBSTITUTION_NOTIFICATION_PLAYER_OUT_ENTRY,
  SUBSTITUTION_NOTIFICATION_PLAYER_OUT_ICON,
  SUBSTITUTION_NOTIFICATION_PLAYER_OUT_TEXT,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/SubstitutionNotification/SubstitutionNotification.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SubstitutionNotificationSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SUBSTITUTION_NOTIFICATION}`));
  }

  get title() {
    return this.element.$(`~${SUBSTITUTION_NOTIFICATION_TITLE}`);
  }

  get playerInEntry() {
    return this.element.$(`~${SUBSTITUTION_NOTIFICATION_PLAYER_IN_ENTRY}`);
  }

  get playerInIcon() {
    return this.element.$(`~${SUBSTITUTION_NOTIFICATION_PLAYER_IN_ICON}`);
  }

  get playerInText() {
    return this.element.$(`~${SUBSTITUTION_NOTIFICATION_PLAYER_IN_TEXT}`);
  }

  get playerOutEntry() {
    return this.element.$(`~${SUBSTITUTION_NOTIFICATION_PLAYER_OUT_ENTRY}`);
  }

  get playerOutIcon() {
    return this.element.$(`~${SUBSTITUTION_NOTIFICATION_PLAYER_OUT_ICON}`);
  }

  get playerOutText() {
    return this.element.$(`~${SUBSTITUTION_NOTIFICATION_PLAYER_OUT_TEXT}`);
  }
}

module.exports = SubstitutionNotificationSO;
