const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TEST_ID,
  QUICK_LINK,
  FOOTBALL_FIXTURE_CARD,
  MARKET,
  TITLE,
  MARKET_RULES,
  COLLAPSE_TITLE,
  SELECTION_BUTTON,
} = require("./market-page.selectors");

module.exports = class MarketPagePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get footballFixtureCard() {
    return this.element.$(FOOTBALL_FIXTURE_CARD);
  }

  get quickLink() {
    return this.element.$(QUICK_LINK);
  }

  get market() {
    return this.element.$(MARKET);
  }

  get marketTitle() {
    return this.element.$(TITLE);
  }

  get marketRulesButton() {
    return this.element.$(MARKET_RULES);
  }

  get collapseTitle() {
    return this.element.$(COLLAPSE_TITLE);
  }

  get selectionButton() {
    return this.element.$(SELECTION_BUTTON);
  }
};
