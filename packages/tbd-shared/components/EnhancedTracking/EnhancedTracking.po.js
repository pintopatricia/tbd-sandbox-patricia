const { BasePO } = require("@ppb/wdio-lazy-element");

const { TEST_ID, TRACKING_BARS } = require("./EnhancedTracking.web.selectors");

module.exports = class EnhancedTrackingCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get trackingBars() {
    return this.element.$$(TRACKING_BARS);
  }
};
