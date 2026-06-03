const {
  CARD_CONTAINER,
  LEG_ODDS,
} = require("@ppb/tbd-shared/components/ObbOnboardingCard/ObbOnboardingCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ObbOnboardingCardSO extends BaseSO {
  constructor(scopedElement) {
    super(scopedElement || $(`~${CARD_CONTAINER}`));
  }

  get legOdds() {
    return this.element.$$(`~${LEG_ODDS}`);
  }
}

module.exports = ObbOnboardingCardSO;
