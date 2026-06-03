const {
  RADIO_BUTTON,
  RADIO_BUTTON_INPUT,
  RADIO_BUTTON_VISUAL_CHECKED,
  RADIO_BUTTON_VISUAL_DISABLED,
  RADIO_BUTTON_VISUAL_CHECKED_DISABLED,
} = require("@ppb/the-wall-web/components/bricks/RadioButton/RadioButton.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RadioListPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(RADIO_BUTTON));
  }

  /**
   * Returns the input for the radio button
   */
  get input() {
    return this.element.$(RADIO_BUTTON_INPUT);
  }

  /**
   * Returns a selected radio button visual representation
   */
  get checked() {
    return this.element.$(RADIO_BUTTON_VISUAL_CHECKED);
  }

  /**
   * Returns a disabled radio button visual representation
   */
  get disabled() {
    return this.element.$(RADIO_BUTTON_VISUAL_DISABLED);
  }

  /**
   * Returns a selected and disabled radio button visual representation
   */
  get checkedDisabled() {
    return this.element.$(RADIO_BUTTON_VISUAL_CHECKED_DISABLED);
  }
};
