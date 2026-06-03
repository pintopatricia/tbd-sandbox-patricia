const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TEST_ID,
  CARD,
  BADGE,
} = require("@ppb/tbd-shared/components/ObbOnboardingCardsCardGroup/ObbOnboardingCardsCardGroup.web.selectors");
const {
  TEST_ID: ONBOARDING_CARD_TEST_ID,
} = require("@ppb/tbd-shared/components/ObbOnboardingCard/ObbOnboardingCard.web.selectors");
const ObbOnboardingCardPO = require("./obb-onboarding-card.po");

module.exports = class ObbOnboardingCardsCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get cards() {
    return this.element.$$(CARD);
  }

  get badge() {
    return this.element.$(BADGE);
  }

  cardAt(index) {
    return new ObbOnboardingCardPO(this.lazyElement, this.element.$$(ONBOARDING_CARD_TEST_ID)[index]);
  }
};
