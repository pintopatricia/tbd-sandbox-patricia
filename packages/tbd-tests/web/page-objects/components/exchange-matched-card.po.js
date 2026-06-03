const {
  TEST_ID,
  HEADER,
  RESULTS,
  FREE_BETS,
} = require("@ppb/tbd-shared/components/Betslip/ExchangeInlineReceipt/snowflakes/PlacedBetCard/PlacedBetCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ExchangeMatchedCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get header() {
    return this.element.$(HEADER);
  }

  get results() {
    return this.element.$(RESULTS);
  }

  get freeBets() {
    return this.element.$(FREE_BETS);
  }
}

module.exports = ExchangeMatchedCardPO;
