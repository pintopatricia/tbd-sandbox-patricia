const { BasePO } = require("@ppb/wdio-lazy-element");
const { SBK_BET_LEG_CARD, SBK_BET_LEG_CARD_CONTENT } = require("./SportsbookBetLegCard.web.selectors");

module.exports = class SportsbookBetLegCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(SBK_BET_LEG_CARD));
  }

  get contentCards() {
    return this.element.$$(SBK_BET_LEG_CARD_CONTENT);
  }
};
