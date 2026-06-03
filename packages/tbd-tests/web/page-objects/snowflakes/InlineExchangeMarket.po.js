const {
  TEST_ID,
  GROUPS,
  SWIMLANE,
  BET_BUTTONS,
  BACK_SELECTIONS_BET_BUTTON,
  LAY_SELECTIONS_BET_BUTTON,
} = require("@ppb/tbd-shared/components/ExchangeMarket/snowflakes/InlineExchangeMarket/InlineExchangeMarket.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class InlineExchangeMarketPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  static get states() {
    return {
      selected: "Selected",
    };
  }

  get groups() {
    return this.element.$$(GROUPS);
  }

  get swimlane() {
    return this.element.$$(SWIMLANE);
  }

  get betButtons() {
    return this.element.$$(BET_BUTTONS);
  }

  get backSelections() {
    return this.element.$$(BACK_SELECTIONS_BET_BUTTON);
  }

  get laySelections() {
    return this.element.$$(LAY_SELECTIONS_BET_BUTTON);
  }
}

module.exports = InlineExchangeMarketPO;
