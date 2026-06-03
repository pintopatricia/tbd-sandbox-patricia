const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TEST_ID,
  BET_BUTTON_LABEL,
} = require("@ppb/tbd-shared/components/ObbOnboardingCard/ObbOnboardingCard.web.selectors");
const microPlayerSelectors = require("@ppb/tbd-shared/components/ObbMicroPlayer/ObbMicroPlayer.web.selectors");

module.exports = class ObbOnboardingCardPO extends BasePO {
  constructor(lazyElement, scopedElement) {
    super(lazyElement, scopedElement || $(TEST_ID));
  }

  get legOdds() {
    return this.element.$$(BET_BUTTON_LABEL);
  }

  get playerNames() {
    return this.element.$(microPlayerSelectors.MULTIPLE_PLAYERS_NAMES);
  }
};
