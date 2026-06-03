const { TEST_ID: COUPON } = require("@ppb/tbd-shared/components/Coupon/Coupon.web.selectors");
const { TEST_ID: QUICK_LINKS } = require("@ppb/tbd-shared/components/QuickLinksCard/QuickLinksCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TEST_ID,
  PRIMARY_EVENT_CARD,
  SCROLLABLE_SWIMLANE,
  EVENT_MARKET_SWIMLANE_TITLE,
  ACTION_LINK,
  CARD_GROUPS,
  CONTENT_SUMMARY_CARD,
  PEBBLE_CARD_GROUP,
} = require("./sport-page.selectors");

module.exports = class SportPagePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get cardGroups() {
    return this.element.$$(CARD_GROUPS);
  }

  get contentSummaryCards() {
    return this.element.$$(CONTENT_SUMMARY_CARD);
  }

  get primaryEventCards() {
    return this.element.$$(PRIMARY_EVENT_CARD);
  }

  get scrollableSwimlanes() {
    return this.element.$$(SCROLLABLE_SWIMLANE);
  }

  get eventMarketSwimlaneTitle() {
    return this.element.$$(EVENT_MARKET_SWIMLANE_TITLE);
  }

  get actionLink() {
    return this.element.$$(ACTION_LINK);
  }

  get coupons() {
    return this.element.$$(COUPON);
  }

  get quickLinksCards() {
    return this.element.$$(QUICK_LINKS);
  }

  get pebbleCardGroups() {
    return this.element.$$(PEBBLE_CARD_GROUP);
  }
};
