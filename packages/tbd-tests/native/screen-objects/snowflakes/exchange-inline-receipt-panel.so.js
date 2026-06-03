const {
  PLACED_BET,
} = require("@ppb/tbd-shared/components/Betslip/ExchangeInlineReceipt/snowflakes/ExchangeInlineReceiptPanel/ExchangeInlineReceiptPanel.native.selectors");
const { INLINE_PANEL } = require("@ppb/tbd-shared/components/Betslip/InlinePanel/InlinePanel.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ExchangeInlineReceiptPanelSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${INLINE_PANEL}`));
  }

  get placedBetCards() {
    return this.element.$$(`~${PLACED_BET}`);
  }
}

module.exports = ExchangeInlineReceiptPanelSO;
