const {
  TEST_ID,
  PLAYER_NAME,
} = require("@ppb/tbd-shared/components/ObbPlayersRowCard/ObbPlayersRowCard.web.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class ObbPlayersRowCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get playerCardName() {
    return this.element.$(PLAYER_NAME);
  }
};
