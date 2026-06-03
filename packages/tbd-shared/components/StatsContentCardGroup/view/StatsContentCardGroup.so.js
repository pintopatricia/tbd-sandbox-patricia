const { BaseSO } = require("@ppb/wdio-lazy-element");
const { STATS_CONTENT, STATS_CONTENT_CARD_GROUP_TAB } = require("./StatsContentCardGroup.native.selectors");

class StatsContentCardGroupSO extends BaseSO {
  /**
   * Creates a stats content card group screen object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${STATS_CONTENT}`));
  }

  /**
   * Gets the tabs
   * @return {HTMLElement} The tabs
   */
  get tabs() {
    return this.element.$$(`~${STATS_CONTENT_CARD_GROUP_TAB}`);
  }
}

module.exports = StatsContentCardGroupSO;
