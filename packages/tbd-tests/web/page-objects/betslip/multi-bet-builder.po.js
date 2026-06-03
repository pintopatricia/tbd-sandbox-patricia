const { TEST_ID } = require("@ppb/tbd-shared/components/Betslip/MultiBetBuilderCard/MultiBetBuilderCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class MultiBetBuilderPO extends BasePO {
  /**
   * Creates a multi bet builder card page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = MultiBetBuilderPO;
