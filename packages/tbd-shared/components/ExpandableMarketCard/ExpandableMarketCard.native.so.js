const { CARD_TITLE } = require("@ppb/the-wall-native/components/Card/Card.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const { EXPANDABLE_MARKET_HEADER } = require("./ExpandableMarketCard.native.selectors");

module.exports = class ExpandableMarketCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${EXPANDABLE_MARKET_HEADER}`));
  }

  get title() {
    return this.element.$(`~${CARD_TITLE}`);
  }
};
