const { TEST_ID, CLOCK_TEXT } = require("@ppb/tbd-shared/components/UserProfile/snowflakes/Clock/Clock.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ClockPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the text
   * Uses the `TEXT` selector
   */
  get text() {
    return this.element.$(CLOCK_TEXT);
  }
}

module.exports = ClockPO;
