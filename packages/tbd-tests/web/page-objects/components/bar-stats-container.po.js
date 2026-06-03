const { BARSTATS_CONTAINER: TEST_ID } = require("@ppb/the-wall-web/components/rooms/MatchStats/MatchStats.selectors");
const { TEST_ID: BAR_WRAP } = require("@ppb/the-wall-web/components/walls/BarStat/BarStat.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class BarStatsContainerPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the bar statistics
   * @return {HTMLElement} bar statistics element
   */
  get barStats() {
    return this.element.$$(BAR_WRAP);
  }
};
