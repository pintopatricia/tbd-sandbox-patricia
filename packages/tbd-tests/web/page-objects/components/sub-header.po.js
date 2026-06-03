const { TEST_ID } = require("@ppb/the-wall-web/components/bricks/SubHeader/SubHeader.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SubHeaderPO extends BasePO {
  /**
   * Creates a sub header page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = SubHeaderPO;
