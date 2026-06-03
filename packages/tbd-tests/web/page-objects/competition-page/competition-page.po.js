const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TEST_ID,
  SWITCHER_CONTENT,
  EVENT_MARKET_CARD,
  EVENT_LINKS,
  UPCOMING_MATCHES_TITLE,
  SCROLLABLE_SWIMLANE,
  CIRCLE_IMAGE,
  QUICKLINK_TITLE,
  QUICKLINK_LINKS,
  COMPETITION_VIEW_LINK_CARD_LINK,
} = require("./competition-page.selectors");

module.exports = class CompetitionPagePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get switcherContent() {
    return this.element.$(SWITCHER_CONTENT);
  }

  get eventMarketCards() {
    return this.element.$$(EVENT_MARKET_CARD);
  }

  get eventLinks() {
    return this.element.$$(EVENT_LINKS);
  }

  get eventCardSwimlaneTitle() {
    return this.element.$(UPCOMING_MATCHES_TITLE);
  }

  get scrollableSwimlanes() {
    return this.element.$$(SCROLLABLE_SWIMLANE);
  }

  get circleImages() {
    return this.element.$$(CIRCLE_IMAGE);
  }

  get quicklinkTitle() {
    return this.element.$(QUICKLINK_TITLE);
  }

  get quicklinkLinks() {
    return this.element.$$(QUICKLINK_LINKS);
  }

  get competitionViewLinks() {
    return this.element.$$(COMPETITION_VIEW_LINK_CARD_LINK);
  }
};
