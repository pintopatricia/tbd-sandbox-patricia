const {
  TEST_ID,
  BET_TYPE,
  DIVIDEND_BET,
  EACH_WAY,
  LINES,
  RETURNS,
  RETURNS_LABEL,
  STARTING_PRICE,
} = require("@ppb/the-wall-web/components/rooms/BetControls/BetControls.selectors");
const {
  TEST_ID: FIXED_FIELD_TEST_ID,
} = require("@ppb/the-wall-web/components/walls/FixedNumberInputField/FixedNumberInputField.selectors");
const {
  TEST_ID: PNLANDWHATIF_FIELD_TEST_ID,
} = require("@ppb/the-wall-web/components/bricks/PNLAndWhatIf/PNLAndWhatIf.selectors");
const { TEST_ID: ACCA_INSURANCE } = require("@ppb/the-wall-web/components/rooms/AccaInsurance/AccaInsurance.selectors");
const {
  TEST_ID: CURRENCY_FIELD_TEST_ID,
} = require("@ppb/the-wall-web/components/walls/CurrencyNumberInputField/CurrencyNumberInputField.selectors");
const { TEST_ID: PROMO } = require("@ppb/the-wall-web/components/bricks/PromoButton/PromoButton.selectors");
const {
  MESSAGE: HINT_MESSAGE,
  TYPE_WARNING: HINT_WARNING,
} = require("@ppb/the-wall-web/components/bricks/Hint/Hint.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID: ALERT } = require("@ppb/the-wall-web/components/bricks/Alert/Alert.selectors");

class BetControlsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the multiple leg type
   * Uses the `BET_TYPE` selector
   */
  get betType() {
    return this.element.$(BET_TYPE);
  }

  get lines() {
    return this.element.$(LINES);
  }

  get generosityWalletButton() {
    return this.element.$(PROMO);
  }

  get hintMessage() {
    return this.element.$(HINT_MESSAGE);
  }

  get hintWarning() {
    return this.element.$(HINT_WARNING);
  }

  get fixedInput() {
    return this.element.$(FIXED_FIELD_TEST_ID);
  }

  get currencyInput() {
    return this.element.$(CURRENCY_FIELD_TEST_ID);
  }

  get dividend() {
    return this.element.$(DIVIDEND_BET);
  }

  get returns() {
    return this.element.$(RETURNS);
  }

  get returnsLabel() {
    return this.element.$(RETURNS_LABEL);
  }

  get returnsValueContainer() {
    return this.element.$(PNLANDWHATIF_FIELD_TEST_ID);
  }

  get eachWay() {
    return this.element.$(EACH_WAY);
  }

  get startingPrice() {
    return this.element.$(STARTING_PRICE);
  }

  get accaInsurance() {
    return this.element.$(ACCA_INSURANCE);
  }

  get generosityAlertMessage() {
    return this.element.$(ALERT);
  }
}

module.exports = BetControlsPO;
