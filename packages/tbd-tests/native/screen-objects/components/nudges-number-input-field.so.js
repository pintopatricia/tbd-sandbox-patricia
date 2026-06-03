const setNativeInputFieldValue = require("@ppb/the-wall-native/components/InputsAndControls/setNativeInputFieldValue");

const {
  INPUT,
  PLACEHOLDER,
} = require("@ppb/the-wall-native/components/InputsAndControls/NumberInputField/NumberInputField.selectors");
const {
  NUDGES_NUMBER_INPUT_FIELD,
  CURRENCY_SYMBOL,
} = require("@ppb/the-wall-native/components/InputsAndControls/NudgesNumberInputField/NudgesNumberInputField.selectors");
const { NUDGE } = require("@ppb/the-wall-native/components/Nudge/Nudge.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class NudgesNumberInputFieldSO extends BaseSO {
  /**
   * Creates a nudges number field page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${NUDGES_NUMBER_INPUT_FIELD}`));
  }

  get numberField() {
    return this.element.$(`~${INPUT}`);
  }

  get nudgeDown() {
    return this.element.$$(`~${NUDGE}`)[0];
  }

  get nudgeUp() {
    return this.element.$$(`~${NUDGE}`)[1];
  }

  get currencySymbol() {
    return this.element.$(`~${CURRENCY_SYMBOL}`);
  }

  get placeholder() {
    return this.element.$(`~${PLACEHOLDER}`);
  }

  setValue = setNativeInputFieldValue(this.numberField);
}

module.exports = NudgesNumberInputFieldSO;
