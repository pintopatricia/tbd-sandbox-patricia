const { ACTION_LINK_TEXT } = require("@ppb/the-wall-native/components/ActionLink/ActionLink.selectors");
const {
  SCROLLABLE_SWIMLANE,
} = require("@ppb/the-wall-native/components/ScrollableSwimlane/ScrollableSwimlane.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const { QUICK_LINKS } = require("../QuickLinksCard/QuickLinksCard.native.selectors");
const {
  FILTERED_COUPON_CARD_GROUP,
  FILTERED_COUPON_CARD_GROUP_TITLE,
  FILTERED_COUPON_CARD_GROUP_HEADER,
  NO_RESULTS_SECTION,
  NO_RESULTS_BUTTON,
  NO_RESULTS_LABEL,
  BY_TIME_RANGE_MEETING_CARD_GROUPS,
} = require("./FilteredCouponCardGroup.native.selectors");
const { COUPON, COUPON_PLACEHOLDER } = require("../Coupon/Coupon.native.selectors");
const { FUTURE_RACING_TITLE } = require("./FutureRacingCardGroup/FutureRacingCardGroup.native.selectors");

class FilteredCouponCardGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${FILTERED_COUPON_CARD_GROUP}`));
  }

  get filters() {
    return this.element.$(`~${FILTERED_COUPON_CARD_GROUP_HEADER}`);
  }

  get eventCouponCardHeader() {
    return this.element.$(`~${FILTERED_COUPON_CARD_GROUP_HEADER}`);
  }

  get title() {
    return this.element.$(`~${FILTERED_COUPON_CARD_GROUP_TITLE}`);
  }

  get viewAllButton() {
    return this.element.$(`~${ACTION_LINK_TEXT}`);
  }

  get coupons() {
    return this.element.$$(`~${COUPON}`);
  }

  get placeholders() {
    return this.element.$$(`~${COUPON_PLACEHOLDER}`);
  }

  get swimlanes() {
    return this.element.$$(`~${SCROLLABLE_SWIMLANE}`);
  }

  get futureRacingTitle() {
    return this.element.$$(`~${FUTURE_RACING_TITLE}`);
  }

  get quicklinks() {
    return this.element.$$(`~${QUICK_LINKS}`);
  }

  get actionLink() {
    return this.element.$(`~${NO_RESULTS_BUTTON}`);
  }

  get noResults() {
    return this.element.$(`~${NO_RESULTS_SECTION}`);
  }

  get noResultsText() {
    return this.element.$(`~${NO_RESULTS_LABEL}`);
  }

  get byTimeRangeMeetingCardGroups() {
    return this.element.$$(`~${BY_TIME_RANGE_MEETING_CARD_GROUPS}`);
  }
}

module.exports = FilteredCouponCardGroupSO;
