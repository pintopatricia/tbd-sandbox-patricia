const {
  TEST_ID,
  PROGRESS_BAR,
  TRACKING_COUNTER_CURRENT_VALUE,
  TRACKING_COUNTER_GOAL_VALUE,
} = require("@ppb/the-wall-web/components/walls/TrackingBar/TrackingBar.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class TrackingBarPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get progressBar() {
    return this.element.$(PROGRESS_BAR);
  }

  get currentValue() {
    return this.element.$(TRACKING_COUNTER_CURRENT_VALUE);
  }

  get goalValue() {
    return this.element.$(TRACKING_COUNTER_GOAL_VALUE);
  }
};
