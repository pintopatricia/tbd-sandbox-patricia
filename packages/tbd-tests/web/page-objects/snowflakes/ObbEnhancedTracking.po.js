const {
  TEST_ID,
  TRACKING_BAR,
  PLAYER_NAME,
} = require("@ppb/tbd-shared/components/ObbEnhancedTracking/ObbEnhancedTracking.web.selectors");

const { TEST_ID: SHOW_MORE_TEST_ID } = require("@ppb/the-wall-web/components/bricks/ShowMore/ShowMore.selectors");

const { TEST_ID: COUNTER_TEST_ID } = require("@ppb/the-wall-web/components/bricks/Counter/Counter.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class ObbEnhancedTrackingCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get trackingBar() {
    return this.element.$(TRACKING_BAR);
  }

  get playerName() {
    return this.element.$$(PLAYER_NAME);
  }

  get showMoreButton() {
    return this.element.$(SHOW_MORE_TEST_ID);
  }

  get playerStats() {
    return this.element.$$(COUNTER_TEST_ID);
  }
};
