const {
  TEST_ID,
  PROMOTION_TITLE,
  PROMOTION_SUBTITLE,
  PROMOTION_IMAGE,
  PROMOTION_HEADLINE,
  PROMOTION_SUMMARY,
  PROMOTION_ACTION_BUTTON,
} = require("@ppb/tbd-shared/components/PromotionCard/snowflakes/CasinoPromotionCard/CasinoPromotionCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class CasinoPromotionCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(PROMOTION_TITLE);
  }

  get headline() {
    return this.element.$(PROMOTION_HEADLINE);
  }

  get subtitle() {
    return this.element.$(PROMOTION_SUBTITLE);
  }

  get promotionImage() {
    return this.element.$(PROMOTION_IMAGE);
  }

  get actionButton() {
    return this.element.$(PROMOTION_ACTION_BUTTON);
  }

  get summary() {
    return this.element.$(PROMOTION_SUMMARY);
  }
}

module.exports = CasinoPromotionCardPO;
