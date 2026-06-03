const { TEST_ID: CAST_BET_ITEM } = require("@ppb/the-wall-web/components/rooms/CastBet/CastBet.selectors");

const { TEST_ID } = require("@ppb/tbd-shared/components/Betslip/CastBetsCard/CastBetsCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class CastBetsCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get castBets() {
    return this.element.$$(CAST_BET_ITEM);
  }
}

module.exports = CastBetsCardPO;
