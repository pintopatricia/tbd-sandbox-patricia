const {
  BET_BUILDERS_CARD,
  BET_BUILDER_ITEM,
} = require("@ppb/tbd-shared/components/Betslip/BetBuildersCard/BetBuildersCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetBuildersCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BET_BUILDERS_CARD}`));
  }

  get betBuilders() {
    return this.element.$$(`~${BET_BUILDER_ITEM}`);
  }
}

module.exports = BetBuildersCardSO;
