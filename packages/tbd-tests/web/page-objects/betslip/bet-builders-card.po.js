const {
  TEST_ID,
  BET_BUILDER_ITEM,
} = require("@ppb/tbd-shared/components/Betslip/BetBuildersCard/BetBuildersCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BetBuildersCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get betBuilders() {
    return this.element.$$(BET_BUILDER_ITEM);
  }
}

module.exports = BetBuildersCardPO;
