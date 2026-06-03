const { TEST_ID, CHECKBOX, SWITCH } = require("@ppb/the-wall-web/components/bricks/Switch/Switch.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SwitchPO extends BasePO {
  /**
   * Creates a switch page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the webElement of the checkbox input
   * Uses the `CHECKBOX` selector
   */
  get checkbox() {
    return this.element.$(CHECKBOX);
  }

  /**
   * Returns the webElement that toggles the switch
   * Uses the `SWITCH` selector
   */
  get switch() {
    return this.element.$(SWITCH);
  }
}

module.exports = SwitchPO;
