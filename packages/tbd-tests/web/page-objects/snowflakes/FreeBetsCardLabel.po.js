const { TEST_ID, LABEL } = require("@ppb/the-wall-web/components/bricks/FreeBetsCardLabel/FreeBetsCardLabel.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class FreeBetsCardLabelPO extends BasePO {
  /**
   * Creates a free bets card label page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get label() {
    return this.element.$(LABEL);
  }
}

module.exports = FreeBetsCardLabelPO;
