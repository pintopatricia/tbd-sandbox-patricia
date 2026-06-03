const { CHECKBOX_ICON_READ_ONLY } = require("@ppb/the-wall-web/components/bricks/Checkbox/Checkbox.selectors");
const {
  MINI_PROMOTION_CARD,
  MINI_PROMOTION_CARD_FLAG,
  MINI_PROMOTION_CARD_CHECKBOX,
  MINI_PROMOTION_CARD_TEXT_WRAPPER,
  MINI_PROMOTION_CARD_ARROW,
} = require("@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/LoyaltyPromoCard.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class MiniPromotionCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(MINI_PROMOTION_CARD));
  }

  get flag() {
    return this.element.$(MINI_PROMOTION_CARD_FLAG);
  }

  get textWrapper() {
    return this.element.$(MINI_PROMOTION_CARD_TEXT_WRAPPER);
  }

  get checkbox() {
    return this.element.$(MINI_PROMOTION_CARD_CHECKBOX);
  }

  get checkboxReadOnly() {
    return this.element.$(CHECKBOX_ICON_READ_ONLY);
  }

  get arrow() {
    return this.element.$(MINI_PROMOTION_CARD_ARROW);
  }
}

module.exports = MiniPromotionCardPO;
