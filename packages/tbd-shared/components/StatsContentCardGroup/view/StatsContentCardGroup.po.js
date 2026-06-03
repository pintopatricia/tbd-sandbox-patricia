const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, TAB } = require("./StatsContentCardGroup.web.selectors");

class StatsContentCardGroupPO extends BasePO {
  /**
   * Creates a stats content card group page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the tabs elements within the stats content card group
   * @returns {Array<HTMLElement>} An array of tab elements
   */
  get tabs() {
    return this.element.$$(TAB);
  }
}

module.exports = StatsContentCardGroupPO;
