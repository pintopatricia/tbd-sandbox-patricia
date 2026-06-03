const { LIVE_VIDEO_ICON } = require("@ppb/the-wall-native/components/Scoreboard/Duration/Duration.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const { COUPON, FIXTURE_PRESSABLE, STATS_PRESSABLE } = require("./Coupon.native.selectors");

class CouponSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${COUPON}`));
  }

  get fixture() {
    return this.element.$(`~${FIXTURE_PRESSABLE}`);
  }

  get stats() {
    return this.element.$(`~${STATS_PRESSABLE}`);
  }

  get videoAvailable() {
    return this.element.$(`~${LIVE_VIDEO_ICON}`);
  }
}

module.exports = CouponSO;
