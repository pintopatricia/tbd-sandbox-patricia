const {
  TEST_ID,
  PROMOTION_ACTION_BUTTON,
  PROMOTION_HEADER,
  PROMOTION_IMAGE,
  PROMOTION_MI_HREF,
  PROMOTION_SUMMARY,
  PROMOTION_TERMS_AND_CONDITIONS_LINK,
} = require("@ppb/tbd-shared/components/PromotionCard/snowflakes/PromotionCard/PromotionCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PromotionCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get actionButton() {
    return this.element.$(PROMOTION_ACTION_BUTTON);
  }

  get header() {
    return this.element.$(PROMOTION_HEADER);
  }

  get image() {
    return this.element.$(PROMOTION_IMAGE);
  }

  get MIHref() {
    return this.element.$(PROMOTION_MI_HREF);
  }

  get summary() {
    return this.element.$(PROMOTION_SUMMARY);
  }

  get termsAndConditionsLink() {
    return this.element.$(PROMOTION_TERMS_AND_CONDITIONS_LINK);
  }
}

module.exports = PromotionCardPO;
