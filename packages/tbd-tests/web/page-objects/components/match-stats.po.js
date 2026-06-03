const {
  TEST_ID,
  CARDSTATS_CONTAINER,
  BARSTATS_CONTAINER,
  CARD_WRAP,
} = require("@ppb/the-wall-web/components/rooms/MatchStats/MatchStats.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class MatchStatsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the card statistics
   * @return {HTMLElement} card statistics list
   */
  get cardStats() {
    return this.element.$$(CARD_WRAP);
  }

  /**
   * Gets the bar statistics
   * @return {HTMLElement} bar statistics list
   */
  get barStatsContainer() {
    return this.element.$$(BARSTATS_CONTAINER)[0];
  }

  get cardStatsContainer() {
    return this.element.$(CARDSTATS_CONTAINER);
  }

  get statsContainer() {
    return this.element.$$(BARSTATS_CONTAINER)[1];
  }
};
