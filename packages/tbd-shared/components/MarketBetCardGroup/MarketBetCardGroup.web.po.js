const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, GROUP_ITEM } = require("./MarketBetCardGroup.web.selectors");

module.exports = class MarketBetCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get groupItems() {
    return this.element.$$(GROUP_ITEM);
  }
};
