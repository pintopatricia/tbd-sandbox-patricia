const {
  EXCHANGE_UNMATCHED_CARD,
  NOTIFICATIONS,
  ACTIONS_CONTAINER,
  CANCEL,
  CONFIRM,
} = require("@ppb/tbd-shared/components/Betslip/ExchangeInlineReceipt/snowflakes/ExchangeUnmatchedCard/ExchangeUnmatchedCard.native.selectors");
const {
  HEADER,
  RESULTS,
  FREE_BETS,
} = require("@ppb/tbd-shared/components/Betslip/ExchangeInlineReceipt/snowflakes/PlacedBetCard/PlacedBetCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ExchangeUnmatchedCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${EXCHANGE_UNMATCHED_CARD}`));
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

  get notifications() {
    return this.element.$(`~${NOTIFICATIONS}`);
  }

  get actionsContainer() {
    return this.element.$(`~${ACTIONS_CONTAINER}`);
  }

  get cancel() {
    return this.element.$(`~${CANCEL}`);
  }

  get confirm() {
    return this.element.$(`~${CONFIRM}`);
  }
}

module.exports = ExchangeUnmatchedCardSO;
