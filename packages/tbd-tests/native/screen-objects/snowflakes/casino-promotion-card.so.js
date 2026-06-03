const {
  CASINO_PROMOTION_CARD,
  PROMOTION_CARD_TITLE,
  PROMOTION_CARD_SUBTITLE,
  PROMOTION_CARD_TERMS_SUMMARY,
  PROMOTION_CARD_IMAGE,
} = require("@ppb/tbd-shared/components/PromotionCard/snowflakes/CasinoPromotionCard/CasinoPromotionCard.native.selectors");
const { ACTION_BUTTON } = require("@ppb/the-wall-native/components/ActionButton/ActionButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PromotionCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${CASINO_PROMOTION_CARD}`));
  }

  get title() {
    return this.element.$(`~${PROMOTION_CARD_TITLE}`);
  }

  get subtitle() {
    return this.element.$(`~${PROMOTION_CARD_SUBTITLE}`);
  }

  get termsSummary() {
    return this.element.$(`~${PROMOTION_CARD_TERMS_SUMMARY}`);
  }

  get actionButton() {
    return this.element.$(`~${ACTION_BUTTON}`);
  }

  get promotionImage() {
    return this.element.$(`~${PROMOTION_CARD_IMAGE}`);
  }
}

module.exports = PromotionCardSO;
