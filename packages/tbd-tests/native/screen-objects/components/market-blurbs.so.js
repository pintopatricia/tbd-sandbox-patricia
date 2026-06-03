const {
  MARKET_BLURBS,
  MARKET_BLURBS_TEXT,
  MARKET_BLURBS_COLUMN,
  MARKET_BLURBS_MARKET_STATUS,
  MARKET_BLURBS_BUTTON_INFO,
  MARKET_BLURBS_BUTTON_GRAPH,
  MARKET_BLURBS_BOOK_PERCENTAGE,
  MARKET_BLURBS_AZ_SWITCHER,
  MARKET_BLURBS_GOING_INPLAY,
} = require("@ppb/the-wall-native/components/bricks/MarketBlurbs/MarketBlurbs.selectors");

const { MARKET_PROMO } = require("@ppb/the-wall-native/components/bricks/MarketPromo/MarketPromo.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class MarketBlurbsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(MARKET_BLURBS));
  }

  get text() {
    return this.element.$(`~${MARKET_BLURBS_TEXT}`);
  }

  get columnList() {
    return this.element.$$(`~${MARKET_BLURBS_COLUMN}`);
  }

  get marketInfoButton() {
    return this.element.$(`~${MARKET_BLURBS_BUTTON_INFO}`);
  }

  get marketGraphButton() {
    return this.element.$(`~${MARKET_BLURBS_BUTTON_GRAPH}`);
  }

  get marketStatus() {
    return this.element.$(`~${MARKET_BLURBS_MARKET_STATUS}`);
  }

  get bookPercentage() {
    return this.element.$(`~${MARKET_BLURBS_BOOK_PERCENTAGE}`);
  }

  get marketPromo() {
    return this.element.$(`~${MARKET_PROMO}`);
  }

  get azSwitcher() {
    return this.element.$(`~${MARKET_BLURBS_AZ_SWITCHER}`);
  }

  get goingInPlay() {
    return this.element.$(`~${MARKET_BLURBS_GOING_INPLAY}`);
  }
}

module.exports = MarketBlurbsSO;
