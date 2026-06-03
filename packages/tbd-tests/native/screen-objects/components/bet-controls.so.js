const {
  FIXED_NUMBER_INPUT_FIELD,
} = require("@ppb/the-wall-native/components/InputsAndControls/FixedNumberInputField/FixedNumberInputField.selectors");
const {
  CURRENCY_NUMBER_INPUT_FIELD,
} = require("@ppb/the-wall-native/components/InputsAndControls/CurrencyNumberInputField/CurrencyNumberInputField.selectors");
const { PROMO_BUTTON } = require("@ppb/the-wall-native/components/InputsAndControls/PromoButton/PromoButton.selectors");
const {
  BET_CONTROLS,
  BET_TYPE,
  RETURNS,
  RETURNS_LABEL,
  LINES,
  DIVIDEND_BET,
  EACH_WAY,
  STARTING_PRICE,
} = require("@ppb/the-wall-native/components/Betslip/BetControls/BetControls.selectors");
const { ACCA_INSURANCE } = require("@ppb/the-wall-native/components/Betslip/AccaInsurance/AccaInsurance.selectors");
const { PNL_AND_WHAT_IF } = require("@ppb/the-wall-native/components/PNLAndWhatIf/PNLAndWhatIf.selectors");
const { ALERT } = require("@ppb/the-wall-native/components/Alert/Alert.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetControlsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BET_CONTROLS}`));
  }

  /**
   * Returns the multiple leg type
   * Uses the `BET_TYPE` selector
   */
  get betType() {
    return this.element.$(`~${BET_TYPE}`);
  }

  get generosityWalletButton() {
    return this.element.$(`~${PROMO_BUTTON}`);
  }

  get lines() {
    return this.element.$(`~${LINES}`);
  }

  get dividend() {
    return this.element.$(`~${DIVIDEND_BET}`);
  }

  get fixedInput() {
    return this.element.$(`~${FIXED_NUMBER_INPUT_FIELD}`);
  }

  get eachWay() {
    return this.element.$(`~${EACH_WAY}`);
  }

  get startingPrice() {
    return this.element.$(`~${STARTING_PRICE}`);
  }

  get accaInsurance() {
    return this.element.$(`~${ACCA_INSURANCE}`);
  }

  get currencyInput() {
    return this.element.$(`~${CURRENCY_NUMBER_INPUT_FIELD}`);
  }

  get returns() {
    return this.element.$(`~${RETURNS}`);
  }

  get returnsLabel() {
    return this.element.$(`~${RETURNS_LABEL}`);
  }

  get returnsValueContainer() {
    return this.element.$(`~${PNL_AND_WHAT_IF}`);
  }

  get generosityAlertMessage() {
    return this.element.$(`~${ALERT}`);
  }
}

module.exports = BetControlsSO;
