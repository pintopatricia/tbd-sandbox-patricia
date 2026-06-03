const {
  BET_BUTTON_TEST_ID,
  BET_BUTTON_PRIMARY_LABEL_TEST_ID,
  BET_BUTTON_SECONDARY_LABEL_TEST_ID,
} = require("@ppb/tbd-shared/components/ExchangeBetButtons/snowflakes/BetButton/BetButton.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ExchangeBetButtonSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BET_BUTTON_TEST_ID}`));
  }

  get odd() {
    return this.element.$(`~${BET_BUTTON_PRIMARY_LABEL_TEST_ID}`);
  }

  get liquidity() {
    return this.element.$(`~${BET_BUTTON_SECONDARY_LABEL_TEST_ID}`);
  }
}

module.exports = ExchangeBetButtonSO;
