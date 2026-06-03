const { TEST_ID, LIGHT, DARK } = require("@ppb/the-wall-web/components/PromoBanner/PromoBanner.selectors");
const { TITLE } = require("@ppb/the-wall-web/components/walls/PromoCard/PromoTitle/PromoTitle.selectors");

const {
  TEST_ID: BET_BUTTON,
} = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.selectors");
const {
  CALL_TO_ACTION_BUTTON,
  IMAGE_CONTAINER,
  IMAGE,
  OPT_IN_CONTAINER,
} = require("@ppb/the-wall-web/components/walls/PromoCard/PromoAction/PromoAction.selectors");
const {
  TEST_ID: TERMS_CONTAINER,
  SUMMARY,
} = require("@ppb/the-wall-web/components/walls/PromoCard/PromoTermsAndConditions/PromoTermsAndConditions.selectors");
const { PROMO_TAG } = require("@ppb/the-wall-web/components/walls/PromoCard/PromoTag/PromoTag.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PromoBannerPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  static get themes() {
    return {
      dark: DARK.replace(".", ""),
      light: LIGHT.replace(".", ""),
    };
  }

  get actionButton() {
    return this.element.$(CALL_TO_ACTION_BUTTON);
  }

  get betButton() {
    return this.element.$(BET_BUTTON);
  }

  get fullTermsAndConditions() {
    return this.element.$(TERMS_CONTAINER);
  }

  get summary() {
    return this.element.$(SUMMARY);
  }

  get tag() {
    return this.element.$(PROMO_TAG);
  }

  get title() {
    return this.element.$(TITLE);
  }

  get imageContainer() {
    return this.element.$(IMAGE_CONTAINER);
  }

  get image() {
    return this.element.$(IMAGE);
  }

  get optInContainer() {
    return this.element.$(OPT_IN_CONTAINER);
  }
}

module.exports = PromoBannerPO;
