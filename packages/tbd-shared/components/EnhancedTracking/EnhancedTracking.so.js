const { BaseSO } = require("@ppb/wdio-lazy-element");

const { TEST_ID, TRACKING_BARS } = require("./EnhancedTracking.native.selectors");

class EnhancedTrackingSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get trackingBars() {
    return this.element.$$(`~${TRACKING_BARS}`);
  }
}

module.exports = EnhancedTrackingSO;
