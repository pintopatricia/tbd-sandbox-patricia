const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID } = require("./Market.web.selectors");

module.exports = class MarketPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
};
