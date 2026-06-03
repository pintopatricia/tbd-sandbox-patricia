const { GENERIC_VIEW_CARD } = require("@ppb/tbd-shared/components/GenericView/GenericView.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TEST_ID,
  TITLE,
  EVENT_MARKET_SWIMLANE_TITLE,
  SCROLLABLE_SWIMLANE,
  PLACEHOLDERS,
} = require("./generic-page.selectors");

module.exports = class SportPagePO extends BasePO {
  constructor() {
    super($(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get eventMarketSwimlaneTitle() {
    return this.element.$$(EVENT_MARKET_SWIMLANE_TITLE);
  }

  get scrollableSwimlanes() {
    return this.element.$$(SCROLLABLE_SWIMLANE);
  }

  get genericViewCards() {
    return this.element.$$(GENERIC_VIEW_CARD);
  }

  get placeholders() {
    return this.element.$$(PLACEHOLDERS);
  }
};
