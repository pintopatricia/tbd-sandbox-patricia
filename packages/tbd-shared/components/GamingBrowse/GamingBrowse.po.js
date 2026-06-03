const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, RESULTS_CONTAINER } = require("./GamingBrowse.web.selectors");

/**
 * Class that represents the Gaming Browse PO
 *
 */
module.exports = class GamingBrowsePO extends BasePO {
  /**
   * Constructor for the Gaming Browse PO
   * By default it sends the root element as lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get resultsContainer() {
    return this.element.$(RESULTS_CONTAINER);
  }
};
