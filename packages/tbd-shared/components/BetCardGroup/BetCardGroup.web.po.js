const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, GROUP_ITEM } = require("./BetCardGroup.selectors");

module.exports = class BetCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get groupItems() {
    return this.element.$$(GROUP_ITEM);
  }
};
