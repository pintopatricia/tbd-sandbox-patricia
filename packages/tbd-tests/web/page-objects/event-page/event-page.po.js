const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TEST_ID,
  QUICKLINK_TITLE,
  SCROLLABLE_SWIMLANE,
  QUICKLINK_LINKS,
  CARD_GROUPS,
  EXCHANGE_MARKET,
  MARKET_CONTAINER,
  HALF_TIME_SPECIALS_SWIMLANE_CARD_GROUP,
} = require("./event-page.selectors");

module.exports = class EventPagePO extends BasePO {
  constructor() {
    super($(TEST_ID));
  }

  get cardGroups() {
    return this.element.$$(CARD_GROUPS);
  }

  get quicklinkTitle() {
    return this.element.$(QUICKLINK_TITLE);
  }

  get quicklinkLinks() {
    return this.element.$$(QUICKLINK_LINKS);
  }

  get scrollableSwimlanes() {
    return this.element.$$(SCROLLABLE_SWIMLANE);
  }

  get halfTimeSpecialsSwimlaneCardGroups() {
    return this.element.$$(HALF_TIME_SPECIALS_SWIMLANE_CARD_GROUP);
  }

  get markets() {
    return this.element.$$(MARKET_CONTAINER);
  }

  get exchangeMarkets() {
    return this.element.$$(EXCHANGE_MARKET);
  }
};
