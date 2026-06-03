const {
  INPUT,
} = require("@ppb/the-wall-native/components/InputsAndControls/NumberInputField/NumberInputField.selectors");
const setNativeInputFieldValue = require("@ppb/the-wall-native/components/InputsAndControls/setNativeInputFieldValue");
const {
  CURRENCY_SYMBOL,
  MULTIPLIER,
  PREFIX,
  CURRENCY_NUMBER_INPUT_FIELD,
} = require("@ppb/the-wall-native/components/InputsAndControls/CurrencyNumberInputField/CurrencyNumberInputField.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class CurrencyNumberInputFieldSO extends BaseSO {
  /**
   * Creates a currency number field page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${CURRENCY_NUMBER_INPUT_FIELD}`));
  }

  get numberField() {
    return this.element.$(`~${INPUT}`);
  }

  get prefix() {
    return this.element.$(`~${PREFIX}`);
  }

  get multiplier() {
    return this.element.$(`~${MULTIPLIER}`);
  }

  get currencySymbol() {
    return this.element.$(`~${CURRENCY_SYMBOL}`);
  }

  setValue = setNativeInputFieldValue(this.numberField);
}

module.exports = CurrencyNumberInputFieldSO;
