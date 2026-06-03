const {
  PROMOTION_CARD,
  PROMOTION_CARD_NAME,
  PROMOTION_CARD_TITLE,
  PROMOTION_CARD_TERMS_SUMMARY,
  PROMOTION_CARD_TERMS_LABEL,
  PROMOTION_CARD_TERMS_PRESSABLE,
  PROMOTION_CARD_ODDS_BOOST_ICON,
} = require("@ppb/tbd-shared/components/PromotionCard/snowflakes/PromotionCard/PromotionCard.native.selectors");
const { ACTION_BUTTON } = require("@ppb/the-wall-native/components/ActionButton/ActionButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PromotionCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PROMOTION_CARD}`));
  }

  get oddsBoostIcon() {
    return this.element.$(`~${PROMOTION_CARD_ODDS_BOOST_ICON}`);
  }

  get name() {
    return this.element.$(`~${PROMOTION_CARD_NAME}`);
  }

  get title() {
    return this.element.$(`~${PROMOTION_CARD_TITLE}`);
  }

  get termsSummary() {
    return this.element.$(`~${PROMOTION_CARD_TERMS_SUMMARY}`);
  }

  get termsLabel() {
    return this.element.$(`~${PROMOTION_CARD_TERMS_LABEL}`);
  }

  get termsPressable() {
    return this.element.$(`~${PROMOTION_CARD_TERMS_PRESSABLE}`);
  }

  get actionButton() {
    return this.element.$(`~${ACTION_BUTTON}`);
  }
}

module.exports = PromotionCardSO;
