const { COUPON_ID } = require("@ppb/the-wall-web/components/walls/EventHeader/EventHeader.selectors");
const { TEST_ID: TEAMS_ID } = require("@ppb/the-wall-web/components/bricks/Teams/Teams.selectors");
const { TEST_ID: DURATION_ID } = require("@ppb/the-wall-web/components/bricks/Duration/Duration.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class CouponPO extends BasePO {
  constructor(lazyElement, defaultLazyElement = $(COUPON_ID)) {
    super(lazyElement, defaultLazyElement);
  }

  get teams() {
    return this.element.$(TEAMS_ID);
  }

  get duration() {
    return this.element.$(DURATION_ID);
  }
}

module.exports = CouponPO;
