const { TEST_ID: COUNTER } = require("@ppb/the-wall-web/components/bricks/Counter/Counter.selectors");
const {
  TEST_ID,
  TITLE,
} = require("@ppb/tbd-shared/components/Betslip/RootBetslip/snowflakes/Minimized/Minimized.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class MinimizedPO extends BasePO {
  /**
   * Creates a sportsbook minimized betslip page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the webElement of the counter
   */
  get counter() {
    return this.element.$(COUNTER);
  }

  /**
   * Returns the webElement of the title
   */
  get title() {
    return this.element.$(TITLE);
  }
}

module.exports = MinimizedPO;
