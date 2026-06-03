const { CAST_BET, CAST_BET_TITLE } = require("@ppb/the-wall-native/components/Betslip/CastBet/CastBet.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class CastBetSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(CAST_BET));
  }

  get title() {
    return this.element.$(`~${CAST_BET_TITLE}`);
  }
}

module.exports = CastBetSO;
