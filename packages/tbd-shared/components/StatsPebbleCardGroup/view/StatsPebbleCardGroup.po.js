const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID } = require("./StatsPebbleCardGroup.selectors");

class StatsPebbleCardGroupPO extends BasePO {
  /**
   * Creates a stats pebble card group page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = StatsPebbleCardGroupPO;
