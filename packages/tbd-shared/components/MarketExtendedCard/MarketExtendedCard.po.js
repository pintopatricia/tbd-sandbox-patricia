const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, RUNNERS } = require("./MarketExtendedCard.web.selectors");

/**
 * Class that represents the Race View Link Card PO
 *
 */
module.exports = class MarketExtendedCardPO extends BasePO {
  /**
   * Constructor for the  Race View Link Card PO
   * By default it sends the root element as lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get runners() {
    return this.element.$$(RUNNERS);
  }
};
