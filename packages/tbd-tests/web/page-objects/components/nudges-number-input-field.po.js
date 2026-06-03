const {
  NUMBER_FIELD,
  PLACEHOLDER,
} = require("@ppb/the-wall-web/components/bricks/NumberInputField/NumberInputField.selectors");
const {
  TEST_ID,
  NUDGE_DOWN,
  NUDGE_DOWN_ENABLED,
  NUDGE_DOWN_DISABLED,
  NUDGE_UP,
  NUDGE_UP_ENABLED,
  NUDGE_UP_DISABLED,
} = require("@ppb/the-wall-web/components/walls/NudgesNumberInputField/NudgesNumberInputField.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class NudgesNumberInputFieldPO extends BasePO {
  /**
   * Creates a nudges number field page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get numberField() {
    return this.element.$(NUMBER_FIELD);
  }

  get placeholder() {
    return this.element.$(PLACEHOLDER);
  }

  get nudgeDown() {
    return this.element.$(NUDGE_DOWN);
  }

  get nudgeDownEnabled() {
    return this.element.$(NUDGE_DOWN_ENABLED);
  }

  get nudgeDownDisabled() {
    return this.element.$(NUDGE_DOWN_DISABLED);
  }

  get nudgeUp() {
    return this.element.$(NUDGE_UP);
  }

  get nudgeUpEnabled() {
    return this.element.$(NUDGE_UP_ENABLED);
  }

  get nudgeUpDisabled() {
    return this.element.$(NUDGE_UP_DISABLED);
  }

  /**
   * Sets the value to be used on the numberField element
   */
  async setValue(value) {
    const currentValue = await this.numberField.getValue();

    if (currentValue) {
      await this.numberField.clearValue();

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

module.exports = NudgesNumberInputFieldPO;
