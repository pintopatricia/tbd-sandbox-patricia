const { ODDS_MOVEMENT } = require("@ppb/the-wall-native/components/OddsMovement/OddsMovement.selectors");
const {
  INPUT,
} = require("@ppb/the-wall-native/components/InputsAndControls/NumberInputField/NumberInputField.selectors");
const {
  PREVIOUS_VALUE,
} = require("@ppb/the-wall-native/components/InputsAndControls/FixedNumberInputField/ValueIndicator/ValueIndicator.selectors");
const {
  FIXED_NUMBER_INPUT_FIELD,
} = require("@ppb/the-wall-native/components/InputsAndControls/FixedNumberInputField/FixedNumberInputField.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class FixedNumberInputFieldSO extends BaseSO {
  /**
   * Creates a fixed number field page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${FIXED_NUMBER_INPUT_FIELD}`));
  }

  get numberField() {
    return this.element.$(`~${INPUT}`);
  }

  get previousValue() {
    return this.element.$(`~${PREVIOUS_VALUE}`);
  }

  get oddsMovement() {
    return this.element.$(`~${ODDS_MOVEMENT}`);
  }
}

module.exports = FixedNumberInputFieldSO;
