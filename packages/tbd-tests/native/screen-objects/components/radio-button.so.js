const {
  RADIO_BUTTON,
  RADIO_BUTTON_CHECKED,
  RADIO_BUTTON_UNCHECKED,
} = require("@ppb/the-wall-native/components/RadioButton/RadioButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RadioListSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RADIO_BUTTON}`));
  }

  /**
   * Returns a selected radio button
   * Uses the `RADIO_BUTTON_CHECKED` selector
   */
  get checked() {
    return this.element.$(`~${RADIO_BUTTON_CHECKED}`);
  }

  /**
   * Returns a non selected radio button
   * Uses the `RADIO_BUTTON_UNCHECKED` selector
   */
  get unchecked() {
    return this.element.$(`~${RADIO_BUTTON_UNCHECKED}`);
  }
}

module.exports = RadioListSO;
