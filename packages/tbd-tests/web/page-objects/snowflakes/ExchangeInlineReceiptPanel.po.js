const {
  PLACED_BET,
} = require("@ppb/tbd-shared/components/Betslip/ExchangeInlineReceipt/snowflakes/ExchangeInlineReceiptPanel/ExchangeInlineReceiptPanel.web.selectors");
const { TEST_ID } = require("@ppb/tbd-shared/components/Betslip/InlinePanel/InlinePanel.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ExchangeInlineReceiptPanelPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get placedBetCards() {
    return this.element.$$(PLACED_BET);
  }
}

module.exports = ExchangeInlineReceiptPanelPO;
