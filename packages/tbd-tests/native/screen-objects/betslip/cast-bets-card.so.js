const { CAST_BET } = require("@ppb/the-wall-native/components/Betslip/CastBet/CastBet.selectors");
const { TEST_ID } = require("@ppb/tbd-shared/components/Betslip/CastBetsCard/CastBetsCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class CastBetsCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get castBets() {
    return this.element.$$(`~${CAST_BET}`);
  }
}

module.exports = CastBetsCardSO;
