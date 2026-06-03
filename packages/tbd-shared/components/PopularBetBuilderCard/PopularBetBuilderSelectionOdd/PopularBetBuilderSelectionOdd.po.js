const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID } = require("./PopularBetBuilderSelectionOdd.web.selectors");

class PopularBetBuilderSelectionItemOddPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = PopularBetBuilderSelectionItemOddPO;
