const {
  BET_SPORTSBOOK_RECEIPT,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookReceipt/snowflakes/SportsbookReceiptPanel/snowflakes/BetSportsbookReceipt/BetSportsbookReceipt.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetSportsbookReceipt extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BET_SPORTSBOOK_RECEIPT}`));
  }
}

module.exports = BetSportsbookReceipt;
