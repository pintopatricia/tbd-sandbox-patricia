const {
  TEST_ID,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookReceipt/snowflakes/SportsbookReceiptPanel/snowflakes/BetSportsbookReceipt/BetSportsbookReceipt.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BetSportsbookReceiptPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = BetSportsbookReceiptPO;
