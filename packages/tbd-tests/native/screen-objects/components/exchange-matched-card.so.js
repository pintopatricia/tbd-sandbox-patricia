const {
  PLACED_BET_CARD,
  HEADER,
  RESULTS,
  FREE_BETS,
} = require("@ppb/tbd-shared/components/Betslip/ExchangeInlineReceipt/snowflakes/PlacedBetCard/PlacedBetCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ExchangeMatchedCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PLACED_BET_CARD}`));
  }

  get header() {
    return this.element.$(`~${HEADER}`);
  }

  get results() {
    return this.element.$(`~${RESULTS}`);
  }

  get freeBets() {
    return this.element.$(`~${FREE_BETS}`);
  }
}

module.exports = ExchangeMatchedCardSO;
