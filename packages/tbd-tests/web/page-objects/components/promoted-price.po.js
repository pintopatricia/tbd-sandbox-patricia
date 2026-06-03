const selectors = require("@ppb/tbd-components-promotions/components/SelectionPromoCard/view/SelectionPromoCard.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

const {
  PROMOTED_PRICE,
  PROMOTED_PRICE_PREVIOUS_LABEL,
  PROMOTED_PRICE_PREVIOUS_ODDS,
  PROMOTED_PRICE_CURRENT_LABEL,
  PROMOTED_PRICE_CURRENT_ODDS,
} = selectors;

const testIdSelector = (key) => `[data-testid="${key}"`;

class PromotedPricePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(testIdSelector(PROMOTED_PRICE)));
  }

  get promotedPrice() {
    return this.element;
  }

  get previousOdds() {
    return this.element.$(testIdSelector(PROMOTED_PRICE_PREVIOUS_ODDS));
  }

  get previousLabel() {
    return this.element.$(testIdSelector(PROMOTED_PRICE_PREVIOUS_LABEL));
  }

  get currentOdds() {
    return this.element.$(testIdSelector(PROMOTED_PRICE_CURRENT_ODDS));
  }

  get currentLabel() {
    return this.element.$(testIdSelector(PROMOTED_PRICE_CURRENT_LABEL));
  }
}

module.exports = PromotedPricePO;
