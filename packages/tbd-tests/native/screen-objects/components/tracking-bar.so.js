const {
  TEST_ID,
  PROGRESS_BAR,
  TRACKING_COUNTER_VALUE,
  CURRENT_CONTAINER,
  GOAL_CONTAINER,
  PROGRESS_BAR_FILLED,
} = require("@ppb/the-wall-native/components/TrackingBar/TrackingBar.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class TrackingBarSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get progressBar() {
    return this.element.$(`~${PROGRESS_BAR}`);
  }

  get progressBarFilled() {
    return this.element.$(`~${PROGRESS_BAR_FILLED}`);
  }

  get currentValue() {
    return this.element.$(`~${CURRENT_CONTAINER}`).$(`~${TRACKING_COUNTER_VALUE}`);
  }

  get goalValue() {
    return this.element.$(`~${GOAL_CONTAINER}`).$(`~${TRACKING_COUNTER_VALUE}`);
  }
};
