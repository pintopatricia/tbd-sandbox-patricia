const styles = require("./CouponList.web.modules.json");
const { TEST_ID: COUPONS_TEST_ID, SUPPORTING_CONTENT_BUTTON: STATS_BUTTON } = require("../Coupon/Coupon.web.selectors");

const TEST_ID = styles.couponListContainer;

module.exports = {
  TEST_ID,
  EVENT_COUPONS: `${COUPONS_TEST_ID}`,
  STATS_BUTTONS: `${STATS_BUTTON}`,
};
