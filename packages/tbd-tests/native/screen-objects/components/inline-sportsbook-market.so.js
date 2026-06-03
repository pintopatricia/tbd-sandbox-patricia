const {
  INLINE_SPORTSBOOK_MARKET,
  BET_BUTTON,
} = require("@ppb/the-wall-native/components/Markets/InlineSportsbookMarket/InlineSportsbookMarket.selectors");
const {
  TEST_ID: SPORTSBOOK_BET_BUTTONS,
} = require("@ppb/the-wall-native/components/SportsbookBetButton/SportsbookBetButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class InlineSportsbookMarketSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${INLINE_SPORTSBOOK_MARKET}`));
  }

  get sbkBetButtons() {
    return this.element.$$(`~${SPORTSBOOK_BET_BUTTONS}`);
  }

  get betButtons() {
    return this.element.$$(`~${BET_BUTTON}`);
  }
}

module.exports = InlineSportsbookMarketSO;
