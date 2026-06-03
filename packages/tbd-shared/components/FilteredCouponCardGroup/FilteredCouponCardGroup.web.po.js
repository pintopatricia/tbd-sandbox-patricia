const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TEST_ID,
  CARD_COUPON_HEADER,
  EVENT_COUPONS,
  PLACEHOLDERS,
  TITLE,
  SWIMLANES,
  QUICK_LINKS,
  MARKET_SWITCHER,
  NO_RESULTS,
  NO_RESULTS_LABEL,
  NO_RESULTS_SUGGESTION_LABEL,
  NO_RESULTS_RESET,
  PEBBLE_LIST_CONTAINER,
  BY_TIME_RANGE_MEETING_CARD_GROUPS,
} = require("./FilteredCouponCardGroup.web.selectors");

module.exports = class FilteredCouponCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get marketSwitcher() {
    return this.element.$(MARKET_SWITCHER);
  }

  get pebbleListContainer() {
    return this.element.$(PEBBLE_LIST_CONTAINER);
  }

  get header() {
    return this.element.$(CARD_COUPON_HEADER);
  }

  get headerTitle() {
    return this.element.$(TITLE);
  }

  get eventCoupons() {
    return this.element.$$(EVENT_COUPONS);
  }

  get swimlanes() {
    return this.element.$$(SWIMLANES);
  }

  get byTimeRangeMeetingCardGroups() {
    return this.element.$$(BY_TIME_RANGE_MEETING_CARD_GROUPS);
  }

  get quickLinks() {
    return this.element.$$(QUICK_LINKS);
  }

  get placeholders() {
    return this.element.$$(PLACEHOLDERS);
  }

  get noResultsContainer() {
    return this.element.$(NO_RESULTS);
  }

  get noResultsLabel() {
    return this.element.$(NO_RESULTS_LABEL);
  }

  get noResultsSuggestion() {
    return this.element.$(NO_RESULTS_SUGGESTION_LABEL);
  }

  get resetActionLink() {
    return this.element.$(NO_RESULTS_RESET);
  }
};
