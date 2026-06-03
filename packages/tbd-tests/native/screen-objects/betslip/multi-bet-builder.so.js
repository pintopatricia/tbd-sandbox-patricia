const {
  MULTI_BET_BUILDER_CARD,
} = require("@ppb/tbd-shared/components/Betslip/MultiBetBuilderCard/MultiBetBuilderCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class MultiBetBuilderSO extends BaseSO {
  /**
   * Creates a multi bet builder card page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${MULTI_BET_BUILDER_CARD}`));
  }
}

module.exports = MultiBetBuilderSO;
