const {
  TEST_ID,
  BET_BUTTONS,
} = require("@ppb/the-wall-web/components/bricks/InlineSportsbookMarket/InlineSportsbookMarket.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class InlineSportsbookMarket extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  static get states() {
    return {
      selected: "Selected",
    };
  }

  get betButtons() {
    return this.element.$$(BET_BUTTONS);
  }
}

module.exports = InlineSportsbookMarket;
