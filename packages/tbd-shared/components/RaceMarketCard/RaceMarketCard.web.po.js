const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, MARKET, RACE_DETAILS, RACE_MARKET_CARD_LINK } = require("./RaceMarketCard.web.selectors");

/**
 * Class that represents the Race Market Card PO
 *
 */
module.exports = class RaceMarketCardPO extends BasePO {
  /**
   * Constructor for the Race Market Card PO
   * By default it sends the root element as lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get market() {
    return this.element.$(MARKET);
  }

  get raceDetails() {
    return this.element.$(RACE_DETAILS);
  }

  get raceLink() {
    return this.element.$(RACE_MARKET_CARD_LINK);
  }
};
