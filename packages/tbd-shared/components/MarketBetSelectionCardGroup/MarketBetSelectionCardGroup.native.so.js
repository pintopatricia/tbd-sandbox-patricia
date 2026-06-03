const { BaseSO } = require("@ppb/wdio-lazy-element");

const {
  MARKET_BET_SELECTION_CARD_GROUP,
  MARKET_BET_SELECTION_CARD_GROUP_ITEM,
} = require("./MarketBetSelectionCardGroup.native.selectors");

module.exports = class MarketBetSelectionCardGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MARKET_BET_SELECTION_CARD_GROUP}`));
  }

  get groupItems() {
    return this.element.$$(`~${MARKET_BET_SELECTION_CARD_GROUP_ITEM}`);
  }
};
