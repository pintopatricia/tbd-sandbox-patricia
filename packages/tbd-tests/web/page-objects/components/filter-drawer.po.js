const { TEST_ID } = require("@ppb/the-wall-web/components/rooms/FilterDrawer/FilterDrawer.selectors");
const {
  TEST_ID: FILTER_CRITERIA,
} = require("@ppb/the-wall-web/components/walls/FilterCriteria/FilterCriteria.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class FilterDrawerPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the webElement of the root element for filter drawer
   * Uses the `TEST_ID` selector
   */
  get root() {
    return this.element.$(TEST_ID);
  }

  /**
   * Returns the webElement of the FilterCriteria element for filter drawer
   * Uses the `FILTER_CRITERIA` selector
   */
  get filterCriteria() {
    return this.element.$(FILTER_CRITERIA);
  }
}

module.exports = FilterDrawerPO;
