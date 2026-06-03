const {
  TEST_ID,
  PREVIOUS_VALUE,
  ODDS_MOVEMENT_CONTAINER,
} = require("@ppb/the-wall-web/components/walls/ValueIndicator/ValueIndicator.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ValueIndicatorPO extends BasePO {
  /**
   * Creates a prefix component page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get previousValue() {
    return this.element.$(PREVIOUS_VALUE);
  }

  get oddsMovementContainer() {
    return this.element.$(ODDS_MOVEMENT_CONTAINER);
  }
}

module.exports = ValueIndicatorPO;
