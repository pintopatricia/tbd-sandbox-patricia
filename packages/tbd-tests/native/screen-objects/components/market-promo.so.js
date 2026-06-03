const {
  MARKET_PROMO,
  MARKET_PROMO_TITLE,
  MARKET_PROMO_DESCRIPTION,
  MARKET_PROMO_TERMS_CONDITIONS,
} = require("@ppb/the-wall-native/components/bricks/MarketPromo/MarketPromo.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class MarketPromoSO extends BaseSO {
  constructor(index = 0) {
    super(null, $$(`~${MARKET_PROMO}`)[index]);
  }

  get title() {
    return this.element.$(`~${MARKET_PROMO_TITLE}`);
  }

  get description() {
    return this.element.$(`~${MARKET_PROMO_DESCRIPTION}`);
  }

  get termsAndConditionsButton() {
    return this.element.$(`~${MARKET_PROMO_TERMS_CONDITIONS}`);
  }
}

module.exports = MarketPromoSO;
