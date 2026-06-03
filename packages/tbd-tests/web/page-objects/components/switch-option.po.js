const {
  TEST_ID,
  CHECKBOX,
  SWITCH,
  LABEL,
} = require("@ppb/the-wall-web/components/bricks/SwitchOption/SwitchOption.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SwitchOptionPO extends BasePO {
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

  /**
   * Returns the webElement of label
   * Uses the `LABEL` selector
   */
  get label() {
    return this.element.$(LABEL);
  }
}

module.exports = SwitchOptionPO;
