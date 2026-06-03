const setNativeInputFieldValue = require("@ppb/the-wall-native/components/InputsAndControls/setNativeInputFieldValue");

const {
  NUMBER_FIELD,
  INPUT,
  PLACEHOLDER,
} = require("@ppb/the-wall-native/components/InputsAndControls/NumberInputField/NumberInputField.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class NumberInputFieldSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${NUMBER_FIELD}`));
  }

  get numberField() {
    return this.element.$(`~${INPUT}`);
  }

  get placeholder() {
    return this.element.$(`~${PLACEHOLDER}`);
  }

  setValue = setNativeInputFieldValue(this.numberField);
}

module.exports = NumberInputFieldSO;
