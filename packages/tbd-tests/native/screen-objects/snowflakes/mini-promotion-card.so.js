const {
  MINI_PROMOTION_CARD,
  MINI_PROMOTION_CARD_FLAG,
  MINI_PROMOTION_CARD_OPTIN_STATE_LABEL,
  MINI_PROMOTION_CARD_TEXT,
  MINI_PROMOTION_CARD_TERMS_LABEL,
  MINI_PROMOTION_CARD_CHECKBOX,
  MINI_PROMOTION_CARD_ARROW,
  MINI_PROMOTION_CARD_TEXT_WRAPPER,
} = require("@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/LoyaltyPromoCard.selectors");
const { CHECKBOX_READONLY } = require("@ppb/the-wall-native/components/bricks/Checkbox/Checkbox.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class MiniPromotionCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MINI_PROMOTION_CARD}`));
  }

  get flag() {
    return this.element.$(`~${MINI_PROMOTION_CARD_FLAG}`);
  }

  get optInStateLabel() {
    return this.element.$(`~${MINI_PROMOTION_CARD_OPTIN_STATE_LABEL}`);
  }

  get text() {
    return this.element.$(`~${MINI_PROMOTION_CARD_TEXT}`);
  }

  get termsLabel() {
    return this.element.$(`~${MINI_PROMOTION_CARD_TERMS_LABEL}`);
  }

  get textWrapper() {
    return this.element.$(`~${MINI_PROMOTION_CARD_TEXT_WRAPPER}`);
  }

  get checkbox() {
    return this.element.$(`~${MINI_PROMOTION_CARD_CHECKBOX}`);
  }

  get checkboxReadOnly() {
    return this.element.$(`~${MINI_PROMOTION_CARD_CHECKBOX}`).$(`~${CHECKBOX_READONLY}`);
  }

  get arrow() {
    return this.element.$(`~${MINI_PROMOTION_CARD_ARROW}`);
  }
}

module.exports = MiniPromotionCardSO;
