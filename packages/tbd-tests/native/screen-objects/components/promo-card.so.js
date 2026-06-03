const { PROMO_CARD, PROMO_CARD_SUB_TITLE } = require("@ppb/the-wall-native/components/PromoCard/PromoCard.selectors");
const { PROMO_TAG, PROMO_TAG_LABEL } = require("@ppb/the-wall-native/components/PromoCard/PromoTag/PromoTag.selectors");
const { PROMO_CARD_TITLE } = require("@ppb/the-wall-native/components/PromoCard/PromoTitle/PromoTitle.selectors");
const {
  PROMO_CARD_TERMS_AND_CONDITIONS,
  PROMO_CARD_SUMMARY,
  PROMO_CARD_LINK,
} = require("@ppb/the-wall-native/components/PromoCard/PromoTermsAndConditions/PromoTermsAndConditions.selectors");
const {
  PROMO_CARD_IMAGE_BUTTON_CONTAINER,
  PROMO_CARD_IMAGE,
  PROMO_CARD_ODDSBOOST_BUTTON,
  PROMO_CARD_OPT_IN,
  PROMO_CARD_OPT_IN_TEXT,
} = require("@ppb/the-wall-native/components/PromoCard/PromoAction/PromoAction.selectors");
const {
  PROMO_BOOKMARK_TEXT,
} = require("@ppb/the-wall-native/components/bricks/Indicators/PromoBookmark/PromoBookmark.selectors");
const {
  CHECKBOX_BUTTON,
  CHECKBOX_READONLY,
} = require("@ppb/the-wall-native/components/bricks/Checkbox/Checkbox.selectors");
const {
  STATUS_LABEL_LABEL,
} = require("@ppb/the-wall-native/components/bricks/Indicators/StatusLabel/StatusLabel.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PromotionCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PROMO_CARD}`));
  }

  get tag() {
    return this.element.$(`~${PROMO_TAG}`);
  }

  get tagText() {
    return this.element.$(`~${PROMO_TAG_LABEL}`);
  }

  get title() {
    return this.element.$(`~${PROMO_CARD_TITLE}`);
  }

  get subtitle() {
    return this.element.$(`~${PROMO_CARD_SUB_TITLE}`);
  }

  get termsAndConditions() {
    return this.element.$(`~${PROMO_CARD_TERMS_AND_CONDITIONS}`);
  }

  get summary() {
    return this.element.$(`~${PROMO_CARD_SUMMARY}`);
  }

  get link() {
    return this.element.$(`~${PROMO_CARD_LINK}`);
  }

  get imageButtonContainer() {
    return this.element.$(`~${PROMO_CARD_IMAGE_BUTTON_CONTAINER}`);
  }

  get image() {
    return this.element.$(`~${PROMO_CARD_IMAGE}`);
  }

  get statusLabel() {
    return this.element.$(`~${STATUS_LABEL_LABEL}`);
  }

  get oddsboostButton() {
    return this.element.$(`~${PROMO_CARD_ODDSBOOST_BUTTON}`);
  }

  get bookmarkText() {
    return this.element.$(`~${PROMO_BOOKMARK_TEXT}`);
  }

  get optInContainer() {
    return this.element.$(`~${PROMO_CARD_OPT_IN}`);
  }

  get optInText() {
    return this.element.$(`~${PROMO_CARD_OPT_IN_TEXT}`);
  }

  get optInCheckbox() {
    return this.element.$(`~${CHECKBOX_BUTTON}`);
  }

  get optInCheckboxReadOnly() {
    return this.element.$(`~${CHECKBOX_READONLY}`);
  }
}

module.exports = PromotionCardSO;
