const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, ROUTER_LINK, FOOTBALL_FIXTURE_CARD, MARKET } = require("./EventMarketCard.web.selectors");

/**
 * Class that represents the Event Market Card PO
 *
 */
module.exports = class EventMarketCardPO extends BasePO {
  /**
   * Constructor for the Primary Event Card PO
   * By default it sends the root element as lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get footballFixtureCard() {
    return this.element.$(FOOTBALL_FIXTURE_CARD);
  }

  get market() {
    return this.element.$(MARKET);
  }

  get routerLink() {
    return this.element.$(ROUTER_LINK);
  }
};
