const { BaseSO } = require("@ppb/wdio-lazy-element");
const { BET_CARD_GROUP, BET_CARD_GROUP_ITEM } = require("./BetCardGroup.native.selectors");

module.exports = class BetCardGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BET_CARD_GROUP}`));
  }

  get groupItems() {
    return this.element.$$(`~${BET_CARD_GROUP_ITEM}`);
  }
};
