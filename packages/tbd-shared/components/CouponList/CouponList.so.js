const { BaseSO } = require("@ppb/wdio-lazy-element");
const { COUPON_LIST_CONTAINER } = require("./CouponList.native.selectors");
const { COUPON, COUPON_PLACEHOLDER, STATS_PRESSABLE } = require("../Coupon/Coupon.native.selectors");

class CouponList extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${COUPON_LIST_CONTAINER}`));
  }

  get coupons() {
    return this.element.$$(`~${COUPON}`);
  }

  get placeholders() {
    return this.element.$$(`~${COUPON_PLACEHOLDER}`);
  }

  get statsPressable() {
    return this.element.$$(`~${STATS_PRESSABLE}`);
  }
}

module.exports = CouponList;
