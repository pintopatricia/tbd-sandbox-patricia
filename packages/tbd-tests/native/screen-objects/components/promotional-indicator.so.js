const {
  PROMOTIONAL_INDICATOR,
  PROMOTIONAL_INDICATOR_TEXT,
  PROMOTIONAL_INDICATOR_RIBBON,
} = require("@ppb/the-wall-native/components/bricks/PromotionalIndicator/PromotionalIndicator.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PromotionalIndicatorSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(PROMOTIONAL_INDICATOR));
  }

  get text() {
    return this.element.$(`~${PROMOTIONAL_INDICATOR_TEXT}`);
  }

  get ribbon() {
    return this.element.$(`~${PROMOTIONAL_INDICATOR_RIBBON}`);
  }
}

module.exports = PromotionalIndicatorSO;
