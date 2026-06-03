const {
  TEST_ID,
  FREE_BETS,
  NOTIFICATIONS,
  INPUTS,
  PLACE_BUTTON,
  QUICKSTAKES,
} = require("@ppb/tbd-shared/components/Betslip/ExchangeInlinePlace/snowflakes/ExchangeInlinePlacePanel/ExchangeInlinePlacePanel.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ExchangeInlinePlacePanelPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get freeBets() {
    return this.element.$(FREE_BETS);
  }

  get notifications() {
    return this.element.$(NOTIFICATIONS);
  }

  get inputs() {
    return this.element.$$(INPUTS);
  }

  get placeButton() {
    return this.element.$(PLACE_BUTTON);
  }

  get quickStakes() {
    return this.element.$(QUICKSTAKES);
  }
}

module.exports = ExchangeInlinePlacePanelPO;
