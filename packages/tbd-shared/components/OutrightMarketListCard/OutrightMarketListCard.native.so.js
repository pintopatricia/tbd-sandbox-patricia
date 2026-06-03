const { CARD_TITLE } = require("@ppb/the-wall-native/components/Card/Card.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const {
  OUTRIGHT_MARKET_LIST_CARD,
  OUTRIGHT_MARKET_TITLE,
  INLINE_SPORTSBOOK_MARKET,
} = require("./OutrightMarketListCard.native.selectors");

class OutrightMarketListCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${OUTRIGHT_MARKET_LIST_CARD}`));
  }

  get inlineSportsbookMarkets() {
    return this.element.$$(`~${INLINE_SPORTSBOOK_MARKET}`);
  }

  get marketTitles() {
    return this.element.$$(`~${OUTRIGHT_MARKET_TITLE}`);
  }

  get collapseTitle() {
    return this.element.$(`~${CARD_TITLE}`);
  }
}

module.exports = OutrightMarketListCardSO;
