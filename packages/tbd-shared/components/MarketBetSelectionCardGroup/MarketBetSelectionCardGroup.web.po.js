const { BasePO } = require("@ppb/wdio-lazy-element");

const { TEST_ID, GROUP_ITEM } = require("./MarketBetSelectionCardGroup.web.selectors");

module.exports = class MarketBetSelectionCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get groupItems() {
    return this.element.$$(GROUP_ITEM);
  }
};
