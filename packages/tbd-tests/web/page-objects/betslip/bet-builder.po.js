const { TEST_ID, SUBTITLE, TITLE } = require("@ppb/tbd-shared/components/Betslip/BetBuilder/BetBuilder.web.selectors");
const { TEST_ID: ACCORDION } = require("@ppb/tbd-shared/components/Betslip/BetLegs/BetLegs.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BetBuilderPO extends BasePO {
  /**
   * Creates a multiples card page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get subtitle() {
    return this.element.$(SUBTITLE);
  }

  get accordion() {
    return this.element.$$(ACCORDION);
  }
}

module.exports = BetBuilderPO;
