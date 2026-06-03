const { TEST_ID, BET_INFO_ITEM } = require("@ppb/the-wall-web/components/bricks/BetInfo/BetInfo.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BetInfoPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get infoItems() {
    return this.element.$$(BET_INFO_ITEM);
  }
}

module.exports = BetInfoPO;
