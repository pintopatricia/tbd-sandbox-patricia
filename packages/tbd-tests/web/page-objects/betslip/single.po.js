const { TEST_ID: SINGLE } = require("@ppb/tbd-shared/components/Betslip/Single/Single.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TEST_ID: BET_CONTROLS_TEST_ID,
} = require("@ppb/the-wall-web/components/rooms/BetControls/BetControls.selectors");

class SinglePO extends BasePO {
  /**
   * Creates a sportsbook single card page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(SINGLE));
  }

  get singleControls() {
    return this.element.$(BET_CONTROLS_TEST_ID);
  }
}

module.exports = SinglePO;
