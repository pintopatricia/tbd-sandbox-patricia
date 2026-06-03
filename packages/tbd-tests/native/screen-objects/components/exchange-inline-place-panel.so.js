const { INLINE_PANEL } = require("@ppb/tbd-shared/components/Betslip/InlinePanel/InlinePanel.native.selectors");
const {
  INPUT,
  FREE_BETS,
  NOTIFICATIONS,
  PLACE_BUTTON,
  QUICKSTAKES,
  KEYBOARD,
} = require("@ppb/tbd-shared/components/Betslip/ExchangeInlinePlace/snowflakes/ExchangeInlinePlacePanel/ExchangeInlinePlacePanel.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ExchangeInlinePlacePanelSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${INLINE_PANEL}`));
  }

  get freeBets() {
    return this.element.$(`~${FREE_BETS}`);
  }

  get notifications() {
    return this.element.$(`~${NOTIFICATIONS}`);
  }

  get inputs() {
    return this.element.$$(`~${INPUT}`);
  }

  get placeButton() {
    return this.element.$(`~${PLACE_BUTTON}`);
  }

  get quickStakes() {
    return this.element.$(`~${QUICKSTAKES}`);
  }

  get keyboard() {
    return this.element.$(`~${KEYBOARD}`);
  }
}

module.exports = ExchangeInlinePlacePanelSO;
