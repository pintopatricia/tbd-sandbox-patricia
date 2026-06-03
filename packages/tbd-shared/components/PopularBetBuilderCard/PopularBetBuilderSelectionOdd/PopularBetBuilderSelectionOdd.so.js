const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, ODD } = require("./PopularBetBuilderSelectionOdd.native.selectors");

class PopularBetBuilderSelectionItemOddSO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get odd() {
    return this.element.$(`~${ODD}`);
  }
}

module.exports = PopularBetBuilderSelectionItemOddSO;
