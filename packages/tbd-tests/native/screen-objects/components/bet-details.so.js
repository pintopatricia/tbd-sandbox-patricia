const {
  BET_DETAILS,
  BET_DETAILS_TITLE,
  BET_DETAILS_SUBTITLE,
  BET_DETAILS_ACTION,
  BET_DETAILS_EDIT,
  BET_DETAILS_REMOVE,
  BET_DETAILS_ICON,
  BET_DETAILS_TITLE_HIGHLIGHT,
  BET_DETAILS_90MIN_CONTAINER,
  BET_DETAILS_NOTIFICATIONS_UNAVAILABLE_ICON_CONTAINER,
  LABEL,
} = require("@ppb/the-wall-native/components/BetDetails/BetDetails.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetDetailsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BET_DETAILS}`));
  }

  get title() {
    return this.element.$(`~${BET_DETAILS_TITLE}`);
  }

  get titleHighlight() {
    return this.element.$(`~${BET_DETAILS_TITLE_HIGHLIGHT}`);
  }

  get subtitle() {
    return this.element.$(`~${BET_DETAILS_SUBTITLE}`);
  }

  get action() {
    return this.element.$(`~${BET_DETAILS_ACTION}`);
  }

  get edit() {
    return this.element.$(`~${BET_DETAILS_EDIT}`);
  }

  get remove() {
    return this.element.$(`~${BET_DETAILS_REMOVE}`);
  }

  get icon() {
    return this.element.$(`~${BET_DETAILS_ICON}`);
  }

  get notificationsUnavblIcon() {
    return this.element.$(`~${BET_DETAILS_NOTIFICATIONS_UNAVAILABLE_ICON_CONTAINER}`);
  }

  get ninetyMinIcon() {
    return this.element.$(`~${BET_DETAILS_90MIN_CONTAINER}`);
  }

  get bog() {
    return this.element.$(`~${LABEL}`);
  }
}

module.exports = BetDetailsSO;
