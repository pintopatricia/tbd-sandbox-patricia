const { BaseSO } = require("@ppb/wdio-lazy-element");
const { OPPORTUNITY, TEST_ID } = require("./PriceBoostMultisListCard.native.selectors");

module.exports = class PriceBoostMultisListCardSO extends BaseSO {
  /**
   * Creates a packaged created bets PO instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get opportunities() {
    return this.element.$$(`~${OPPORTUNITY}`);
  }
};
