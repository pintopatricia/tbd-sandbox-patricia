const {
  TEST_ID,
  GROUP_TITLE,
  ITEM_TITLE,
  ITEM_AMOUNT,
} = require("@ppb/tbd-shared/components/MarketGraph/MarketGraphContent/snowflakes/DetailedSummary/DetailedSummary.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class CashBalancesDetailedViewPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get groupTitles() {
    return this.element.$$(GROUP_TITLE);
  }

  get walletTitles() {
    return this.element.$$(ITEM_TITLE);
  }

  get walletAmounts() {
    return this.element.$$(ITEM_AMOUNT);
  }
}

module.exports = CashBalancesDetailedViewPO;
