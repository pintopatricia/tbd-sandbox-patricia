const {
  TEST_ID,
  TRACKING_BAR,
  PLAYER_NAME,
} = require("@ppb/tbd-shared/components/ObbEnhancedTracking/ObbEnhancedTracking.native.selectors");

const { SHOW_MORE } = require("@ppb/the-wall-native/components/bricks/ShowMore/ShowMore.selectors");

const { COUNTER_VALUE } = require("@ppb/the-wall-native/components/Counter/Counter.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class ObbEnhancedTrackingSO extends BaseSO {
  constructor() {
    super($(`~${TEST_ID}`));
  }

  get trackingBar() {
    return this.element.$(`~${TRACKING_BAR}`);
  }

  get playerName() {
    return this.element.$$(`~${PLAYER_NAME}`);
  }

  get showMoreButton() {
    return this.element.$(`~${SHOW_MORE}`);
  }

  get playerStats() {
    return this.element.$$(`~${COUNTER_VALUE}`);
  }
};
