const { TEST_ID } = require("@ppb/the-wall-web/components/walls/PromoCard/PromoCard.selectors");
const { TITLE, SUB_TITLE } = require("@ppb/the-wall-web/components/walls/PromoCard/PromoCard.selectors");
const { LINK, SUMMARY } = require("@ppb/the-wall-web/components/walls/PromoCard/PromoCard.selectors");
const {
  CALL_TO_ACTION_BUTTON,
  IMAGE_CONTAINER,
  IMAGE,
  OPT_IN_CONTAINER,
  BET_BUTTON,
} = require("@ppb/the-wall-web/components/walls/PromoCard/PromoCard.selectors");
const { PROMO_TAG } = require("@ppb/the-wall-web/components/walls/PromoCard/PromoCard.selectors");
const {
  CHECKBOX_ICON_READ_ONLY,
  TEST_ID: CHECKBOX_CONTAINER,
} = require("@ppb/the-wall-web/components/bricks/Checkbox/Checkbox.selectors");
const {
  PROMO_BOOKMARK,
} = require("@ppb/the-wall-web/components/bricks/Indicators/PromoBookmark/PromoBookmark.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PromoCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get actionButton() {
    return this.element.$(BET_BUTTON);
  }

  get imageContainer() {
    return this.element.$(IMAGE_CONTAINER);
  }

  get image() {
    return this.element.$(IMAGE);
  }

  get link() {
    return this.element.$(LINK);
  }

  get title() {
    return this.element.$(TITLE);
  }

  get subtitle() {
    return this.element.$(SUB_TITLE);
  }

  get summary() {
    return this.element.$(SUMMARY);
  }

  get tag() {
    return this.element.$(PROMO_TAG);
  }

  get termsAndConditionsSummary() {
    return this.element.$(SUMMARY);
  }

  get termsAndConditionsLink() {
    return this.element.$(LINK);
  }

  get bookmark() {
    return this.element.$(PROMO_BOOKMARK);
  }

  get ctaButton() {
    return this.element.$(CALL_TO_ACTION_BUTTON);
  }

  get optInContainer() {
    return this.element.$(OPT_IN_CONTAINER);
  }

  get optInCheckbox() {
    return this.element.$(CHECKBOX_CONTAINER);
  }

  get optInCheckboxReadOnly() {
    return this.element.$(CHECKBOX_ICON_READ_ONLY);
  }
}

module.exports = PromoCardPO;
