const {
  EXCHANGE_INLINE_CONFIRM_PANEL,
  FREE_BETS,
} = require("@ppb/tbd-shared/components/Betslip/ExchangeInlineConfirm/snowflakes/ExchangeInlineConfirmPanel/ExchangeInlineConfirmPanel.native.selectors");
const {
  FIXED_NUMBER_INPUT_FIELD,
} = require("@ppb/the-wall-native/components/InputsAndControls/FixedNumberInputField/FixedNumberInputField.selectors");
const {
  CURRENCY_NUMBER_INPUT_FIELD,
} = require("@ppb/the-wall-native/components/InputsAndControls/CurrencyNumberInputField/CurrencyNumberInputField.selectors");
const { ACTION_BUTTON } = require("@ppb/the-wall-native/components/ActionButton/ActionButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ExchangeInlineConfirmPanelSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${EXCHANGE_INLINE_CONFIRM_PANEL}`));
  }

  get price() {
    return this.element.$(`~${FIXED_NUMBER_INPUT_FIELD}`);
  }

  get size() {
    return this.element.$(`~${CURRENCY_NUMBER_INPUT_FIELD}`);
  }

  get edit() {
    return this.element.$$(`~${ACTION_BUTTON}`)[0];
  }

  get confirm() {
    return this.element.$$(`~${ACTION_BUTTON}`)[1];
  }

  get freeBets() {
    return this.element.$(`~${FREE_BETS}`);
  }
}

module.exports = ExchangeInlineConfirmPanelSO;
