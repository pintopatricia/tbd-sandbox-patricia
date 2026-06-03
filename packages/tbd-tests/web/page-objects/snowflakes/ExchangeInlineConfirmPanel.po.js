const {
  TEST_ID: FIXED_INPUT_ID,
} = require("@ppb/the-wall-web/components/walls/FixedNumberInputField/FixedNumberInputField.selectors");
const {
  TEST_ID: CURRENCY_INPUT_ID,
} = require("@ppb/the-wall-web/components/walls/CurrencyNumberInputField/CurrencyNumberInputField.selectors");
const { PRIMARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/PrimaryButton/PrimaryButton.selectors");
const { SECONDARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/SecondaryButton/SecondaryButton.selectors");
const { ACTION: ACTION_ID } = require("@ppb/tbd-shared/components/Betslip/InlinePanel/InlinePanel.web.selectors");
const {
  TEST_ID,
  FREE_BETS,
} = require("@ppb/tbd-shared/components/Betslip/ExchangeInlineConfirm/snowflakes/ExchangeInlineConfirmPanel/ExchangeInlineConfirmPanel.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ExchangeInlineConfirmPanelPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get cancel() {
    return this.element.$(ACTION_ID);
  }

  get price() {
    return this.element.$(FIXED_INPUT_ID);
  }

  get size() {
    return this.element.$(CURRENCY_INPUT_ID);
  }

  get freeBets() {
    return this.element.$(FREE_BETS);
  }

  get edit() {
    return this.element.$(SECONDARY_BUTTON);
  }

  get confirm() {
    return this.element.$(PRIMARY_BUTTON);
  }
}

module.exports = ExchangeInlineConfirmPanelPO;
