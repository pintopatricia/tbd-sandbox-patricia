const { BaseSO } = require("@ppb/wdio-lazy-element");
const { SBK_BET_LEG_CARD, SBK_BET_LEG_CARD_CONTENT } = require("./SportsbookBetLegCard.native.selectors");

class SportsbookBetLegCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SBK_BET_LEG_CARD}`));
  }

  get contentCards() {
    return this.element.$$(`~${SBK_BET_LEG_CARD_CONTENT}`);
  }
}

module.exports = SportsbookBetLegCardSO;
