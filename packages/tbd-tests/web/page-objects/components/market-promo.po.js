const {
  MARKET_PROMO,
  MARKET_PROMO_DESCRIPTION,
  MARKET_PROMO_BUTTONS_CONTAINER,
  MARKET_PROMO_ACTION_LINK,
  MARKET_PROMO_TEXT,
} = require("@ppb/the-wall-web/components/bricks/MarketPromo/MarketPromo.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class MarketPromoPO extends BasePO {
  constructor(index = 0) {
    // For index 0, use the original selector, otherwise use nth-child
    const selector = index === 0 ? MARKET_PROMO : `${MARKET_PROMO}:nth-child(${index + 1})`;
    super(null, $(selector));
  }

  get title() {
    return this.element.$(MARKET_PROMO_TEXT);
  }

  get description() {
    return this.element.$(MARKET_PROMO_DESCRIPTION);
  }

  get marketButtonPromoContainer() {
    return this.element.$(MARKET_PROMO_BUTTONS_CONTAINER);
  }

  get termsButtonPromoContainer() {
    return this.element.$(MARKET_PROMO_ACTION_LINK);
  }

  static async getAllMarketPromos() {
    const elements = await $$(MARKET_PROMO);
    return elements.map((_, index) => new MarketPromoPO(index));
  }
}

module.exports = MarketPromoPO;
