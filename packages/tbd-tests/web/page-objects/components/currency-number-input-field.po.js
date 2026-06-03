const {
  TEST_ID,
  PREFIX,
  MULTIPLIER,
  CURRENCY_SYMBOL,
} = require("@ppb/the-wall-web/components/walls/CurrencyNumberInputField/CurrencyNumberInputField.selectors");
const { NUMBER_FIELD } = require("@ppb/the-wall-web/components/bricks/NumberInputField/NumberInputField.selectors");
const NumberInputFieldPO = require("./number-input-field.po");

class CurrencyNumberInputFieldPO extends NumberInputFieldPO {
  constructor(lazyElement) {
    super(lazyElement ?? $(TEST_ID));
  }

  get prefix() {
    return this.element.$(PREFIX);
  }

  get numberField() {
    return this.element.$(NUMBER_FIELD);
  }

  get multiplier() {
    return this.element.$(MULTIPLIER);
  }

  get currencySymbol() {
    return this.element.$(CURRENCY_SYMBOL);
  }
}

module.exports = CurrencyNumberInputFieldPO;
