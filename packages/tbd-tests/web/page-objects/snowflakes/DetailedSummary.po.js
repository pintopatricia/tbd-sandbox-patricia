const {
  TEST_ID,
  GROUP_TITLE,
  ITEM_TITLE,
  ITEM_AMOUNT,
} = require("@ppb/tbd-shared/components/MarketGraph/MarketGraphContent/snowflakes/DetailedSummary/DetailedSummary.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class DetailedSummaryPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get groupTitle() {
    return this.element.$(GROUP_TITLE);
  }

  get itemTitle() {
    return this.element.$(ITEM_TITLE);
  }

  get itemAmount() {
    return this.element.$(ITEM_AMOUNT);
  }
}

module.exports = DetailedSummaryPO;
