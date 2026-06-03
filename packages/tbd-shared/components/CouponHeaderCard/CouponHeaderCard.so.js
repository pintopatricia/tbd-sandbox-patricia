const { TITLE, COLUMN_LABEL } = require("./snowflakes/CompetitionHeader/CompetitionHeader.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const { COUPON_HEADER } = require("./CouponHeaderCard.native.selectors");

class CouponCardGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${COUPON_HEADER}`));
  }

  get columnLabels() {
    return this.element.$$(`~${COLUMN_LABEL}`);
  }

  get title() {
    return this.element.$(`~${TITLE}`);
  }
}

module.exports = CouponCardGroupSO;
