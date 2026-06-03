const {
  MARKET_BLURBS,
  BOG,
  TEXT,
  MARKET_DEPTH_BUTTON,
  BOOK_PERCENTAGE,
  MARKET_INFO_BUTTON,
  MARKET_GRAPH_BUTTON,
  AZ_SWITCHER,
  GOING_IN_PLAY,
} = require("@ppb/the-wall-web/components/bricks/MarketBlurbs/MarketBlurbs.selectors");

const { MARKET_PROMO } = require("@ppb/the-wall-web/components/bricks/MarketPromo/MarketPromo.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class MarketBlurbsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(MARKET_BLURBS));
  }

  get text() {
    return this.element.$(TEXT);
  }

  get bogBadge() {
    return this.element.$(BOG);
  }

  get marketInfoButton() {
    return this.element.$(MARKET_INFO_BUTTON);
  }

  get marketGraphButton() {
    return this.element.$(MARKET_GRAPH_BUTTON);
  }

  get marketDepthButton() {
    return this.element.$(MARKET_DEPTH_BUTTON);
  }

  get bookPercentage() {
    return this.element.$(BOOK_PERCENTAGE);
  }

  get azSwitcher() {
    return this.element.$(AZ_SWITCHER);
  }

  get marketPromo() {
    return this.element.$(MARKET_PROMO);
  }

  get goingInPlay() {
    return this.element.$(GOING_IN_PLAY);
  }
}

module.exports = MarketBlurbsPO;
