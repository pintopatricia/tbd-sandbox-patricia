const { BasePO } = require("@ppb/wdio-lazy-element");
const { SBK_BET_LEG_CARD_GROUP, SBK_BET_LEG_CARD_GROUP_CARDS } = require("./SportsbookBetLegCardGroup.web.selectors");

module.exports = class SportsbookBetLegCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(SBK_BET_LEG_CARD_GROUP));
  }

  get cards() {
    return this.element.$$(SBK_BET_LEG_CARD_GROUP_CARDS);
  }
};
