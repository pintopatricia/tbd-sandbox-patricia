const {
  TEST_ID,
  TITLE,
  BET_SUMMARY_NOTIFICATIONS_UNAVAILABLE_ICON_CONTAINER,
} = require("@ppb/the-wall-native/components/Betslip/BetSummary/BetSummary.selectors");

const { OPTION_TITLE } = require("@ppb/the-wall-native/components/Option/Option.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetSummarySO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get title() {
    return this.element.$(`~${TITLE}`);
  }

  get accaLabel() {
    return this.element.$(`~${OPTION_TITLE}`);
  }

  get notificationsUnavailableIcon() {
    return this.element.$(`~${BET_SUMMARY_NOTIFICATIONS_UNAVAILABLE_ICON_CONTAINER}`);
  }
}

module.exports = BetSummarySO;
