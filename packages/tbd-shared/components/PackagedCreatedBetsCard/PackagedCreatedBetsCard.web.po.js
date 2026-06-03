const { BasePO } = require("@ppb/wdio-lazy-element");
const { OPPORTUNITY, TEST_ID } = require("./PackagedCreatedBetsCard.web.selectors");

module.exports = class PackagedCreatedBetsCardPO extends BasePO {
  /**
   * Creates a packaged created bets PO instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets all the opportunities in this packaged created bets card
   * @return {HTMLElement} The opportunities
   */
  get opportunities() {
    return this.element.$$(OPPORTUNITY);
  }
};
