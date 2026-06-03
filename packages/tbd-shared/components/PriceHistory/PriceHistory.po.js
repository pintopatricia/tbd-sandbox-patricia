const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID } = require("./PriceHistory.web.selectors");

module.exports = class PriceHistoryPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get value() {
    return this.element.$(TEST_ID);
  }
};
