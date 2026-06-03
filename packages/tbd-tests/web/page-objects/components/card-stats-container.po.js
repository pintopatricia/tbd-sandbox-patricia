const { CARDSTATS_CONTAINER: TEST_ID } = require("@ppb/the-wall-web/components/rooms/MatchStats/MatchStats.selectors");
const { TEST_ID: CARD_WRAP } = require("@ppb/the-wall-web/components/bricks/CardStat/CardStat.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class cardStatsContainer extends BasePO {
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
};
