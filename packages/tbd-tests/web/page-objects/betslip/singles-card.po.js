const { TEST_ID } = require("@ppb/tbd-shared/components/Betslip/SinglesCard/SinglesCard.web.selectors");
const { TEST_ID: SINGLE } = require("@ppb/tbd-shared/components/Betslip/Single/Single.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SinglesCardPO extends BasePO {
  /**
   * Creates a sportsbook single card page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get singles() {
    return this.element.$$(SINGLE);
  }
}

module.exports = SinglesCardPO;
