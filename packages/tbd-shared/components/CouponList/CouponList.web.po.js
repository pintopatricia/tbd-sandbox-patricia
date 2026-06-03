const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, EVENT_COUPONS, STATS_BUTTONS } = require("./CouponList.web.selectors");

module.exports = class CouponListPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get filteredCoupons() {
    return this.element.$$(EVENT_COUPONS);
  }

  get couponStatsButtons() {
    return this.element.$$(STATS_BUTTONS);
  }
};
