const {
  TEST_ID,
  HEADER,
  RESULTS,
  FREE_BETS,
} = require("@ppb/tbd-shared/components/Betslip/ExchangeInlineReceipt/snowflakes/PlacedBetCard/PlacedBetCard.web.selectors");
const {
  NOTIFICATIONS,
  ACTIONS_CONTAINER,
  CANCEL,
  CONFIRM,
} = require("@ppb/tbd-shared/components/Betslip/ExchangeInlineReceipt/snowflakes/ExchangeUnmatchedCard/ExchangeUnmatchedCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ExchangeUnmatchedCardPO extends BasePO {
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

  get notifications() {
    return this.element.$(NOTIFICATIONS);
  }

  get actionsContainer() {
    return this.element.$(ACTIONS_CONTAINER);
  }

  get cancel() {
    return this.element.$(CANCEL);
  }

  get confirm() {
    return this.element.$(CONFIRM);
  }
}

module.exports = ExchangeUnmatchedCardPO;
