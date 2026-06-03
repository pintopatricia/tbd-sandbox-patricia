const {
  TEST_ID,
  PRIMARY_LABEL_TEST_ID,
  SECONDARY_LABEL_TEST_ID,
  NOT_DISABLED,
  SELECTED,
  FLASH_BLUE_ANIMATION,
} = require("@ppb/tbd-shared/components/ExchangeBetButtons/snowflakes/ExchangeBetButton/ExchangeBetButton.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ExchangeBetButtonPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  static get states() {
    return {
      selected: SELECTED.replace(".", ""),
      backFlash: FLASH_BLUE_ANIMATION.replace(".", ""),
    };
  }

  get odd() {
    return this.element.$(PRIMARY_LABEL_TEST_ID);
  }

  get liquidity() {
    return this.element.$(SECONDARY_LABEL_TEST_ID);
  }

  get notDisabled() {
    return this.element.$(NOT_DISABLED);
  }
}

module.exports = ExchangeBetButtonPO;
