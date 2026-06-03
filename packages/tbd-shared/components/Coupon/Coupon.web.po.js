const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, MARKET_NAME, SCOREBOARD_TEAM_NAMES } = require("./Coupon.web.selectors");

module.exports = class CouponPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the coupon market name
   * @return {HTMLElement} The coupon market name
   */
  get marketName() {
    return this.element.$(MARKET_NAME);
  }

  get scoreboardTeamNames() {
    return this.element.$$(SCOREBOARD_TEAM_NAMES);
  }
};
