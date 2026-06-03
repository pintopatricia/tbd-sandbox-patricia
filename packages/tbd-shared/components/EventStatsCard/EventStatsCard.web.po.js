const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID } = require("./EventStatsCard.web.selectors");

/**
 * Class that represents the Event Stats Card PO
 *
 */
module.exports = class EventStatsCardPO extends BasePO {
  /**
   * Constructor for the Primary EventStatsCard PO
   * By default it sends the root element as lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
};
