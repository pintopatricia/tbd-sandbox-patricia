const {
  CARD_CONTAINER: TEST_ID,
} = require("@ppb/tbd-shared/components/ObbOnboardingCardsCardGroup/ObbOnboardingCardsCardGroup.native.selectors");
const {
  CARD_CONTAINER: ONBOARDING_CARD_TEST_ID,
} = require("@ppb/tbd-shared/components/ObbOnboardingCard/ObbOnboardingCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ObbOnboardingCardsCardGroupSO extends BaseSO {
  constructor() {
    super($(`~${TEST_ID}`));
  }

  get cards() {
    return this.element.$$(`~${ONBOARDING_CARD_TEST_ID}`);
  }
}

module.exports = ObbOnboardingCardsCardGroupSO;
