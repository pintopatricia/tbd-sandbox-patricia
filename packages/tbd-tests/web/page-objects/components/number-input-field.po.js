const {
  TEST_ID,
  NUMBER_FIELD,
  PLACEHOLDER,
  STAKE_CONTAINER,
} = require("@ppb/the-wall-web/components/bricks/NumberInputField/NumberInputField.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

// Using this unicode to remove the value from the input
// Bug from webdriverio does not trigger onChange with clearValue or setValue("")
//
// https://github.com/webdriverio/webdriverio/issues/530
const BACKSPACE_UNICODE = "\uE003";

class NumberInputFieldPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get numberField() {
    return this.element.$(NUMBER_FIELD);
  }

  get placeholder() {
    return this.element.$(PLACEHOLDER);
  }

  get stakeContainer() {
    return this.element.$(STAKE_CONTAINER);
  }

  /**
   * Sets the value to be used on the numberField element
   */
  async setValue(value) {
    const currentValue = await this.numberField.getValue();

    if (currentValue) {
      await this.numberField.doubleClick();
      await this.numberField.addValue(BACKSPACE_UNICODE);
      await browser.waitUntil(async () => (await this.numberField.getValue()).length === 0, {
        timeout: 5000,
        timeoutMsg: "Failed to Delete all Characters.",
      });
    }
    await this.numberField.addValue(value);
    await browser.waitUntil(async () => (await this.numberField.getValue()) === value.toString(), {
      timeout: 5000,
      timeoutMsg: "Could not set value.",
    });
  }
}

module.exports = NumberInputFieldPO;
