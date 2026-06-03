const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID } = require("./OutrightMarketListCard.web.selectors");

module.exports = class OutrightMarketListCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
};
