const { HINT } = require("@ppb/the-wall-native/components/Hint/Hint.selectors");
const {
  BET_SELECTION_DETAILS,
  BET_SELECTION_DETAILS_EDIT_BUTTON,
  BET_SELECTION_DETAILS_TITLE,
  BET_SELECTION_DETAILS_SUBTITLE,
  BET_SELECTION_DETAILS_TERTIARY_TITLE,
  BET_SELECTION_DETAILS_REMOVE_BUTTON,
  BET_SELECTION_DETAILS_NOTIFICATIONS_UNAVAILABLE_ICON_CONTAINER,
  BET_SELECTION_DETAILS_90_ICON,
  BET_SELECTION_DETAILS_RACING_LABEL,
  BET_SELECTION_DETAILS_SIDE,
} = require("@ppb/the-wall-native/components/BetDetails/BetSelectionDetails/BetSelectionDetails.selectors");
const { ODDS } = require("@ppb/the-wall-native/components/bricks/Indicators/Odds/Odds.selectors");
const { LABEL } = require("@ppb/the-wall-native/components/bricks/Indicators/Label/Label.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetSelectionDetailsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BET_SELECTION_DETAILS}`));
  }

  get title() {
    return this.element.$(`~${BET_SELECTION_DETAILS_TITLE}`);
  }

  get subtitle() {
    return this.element.$(`~${BET_SELECTION_DETAILS_SUBTITLE}`);
  }

  get tertiaryTitle() {
    return this.element.$(`~${BET_SELECTION_DETAILS_TERTIARY_TITLE}`);
  }

  get odd() {
    return this.element.$(`~${ODDS}`);
  }

  get hint() {
    return this.element.$(`~${HINT}`);
  }

  get notificationsUnavblIcon() {
    return this.element.$(`~${BET_SELECTION_DETAILS_NOTIFICATIONS_UNAVAILABLE_ICON_CONTAINER}`);
  }

  get removeButton() {
    return this.element.$(`~${BET_SELECTION_DETAILS_REMOVE_BUTTON}`);
  }

  get editButton() {
    return this.element.$(`~${BET_SELECTION_DETAILS_EDIT_BUTTON}`);
  }

  get icon90Min() {
    return this.element.$(`~${BET_SELECTION_DETAILS_90_ICON}`);
  }

  get racingLabel() {
    return this.element.$(`~${BET_SELECTION_DETAILS_RACING_LABEL}`).$(`~${LABEL}`);
  }

  get side() {
    return this.element.$(`~${BET_SELECTION_DETAILS_SIDE}`).$(`~${LABEL}`);
  }
}

module.exports = BetSelectionDetailsSO;
