const { TEST_ID, ARROW } = require("@ppb/the-wall-web/components/bricks/OddsMovement/OddsMovement.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class OddsMovementPO extends BasePO {
  /**
   * Creates a odds movement page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get arrow() {
    return this.element.$(ARROW);
  }
}

module.exports = OddsMovementPO;
