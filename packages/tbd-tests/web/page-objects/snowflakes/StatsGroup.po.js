const {
  TEST_ID,
  MAIN_LABEL,
  SECONDARY_LABEL,
  STAT_LABEL,
} = require("@ppb/tbd-shared/components/ObbPvPCard/snowflakes/StatsGroup/StatsGroup.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class StatsGroupPO extends BasePO {
  /**
   * Creates a Stats Group page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the Stats Group main label
   * @return {HTMLElement} The timer main label
   */
  get statsGroupMainLabel() {
    return this.element.$(MAIN_LABEL);
  }

  /**
   * Gets the Stats Group secondary label
   * @return {HTMLElement} The timer secondary label
   */
  get statsGroupSecondaryLabel() {
    return this.element.$(SECONDARY_LABEL);
  }

  /**
   * Gets the list of stat labels
   * @return {HTMLElement} The list of stat labels
   */
  get statsGroupStatsLabel() {
    return this.element.$$(STAT_LABEL);
  }
};
