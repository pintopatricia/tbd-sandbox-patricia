const {
  TEST_ID,
  TITLE,
  ICON,
  EXCHANGE_MARKET,
  SPORTSBOOK_MARKET,
  INLINE_SPORTSBOOK_MARKET,
  CONTENT,
  HEADER,
  END_ELEMENT,
} = require("@ppb/the-wall-web/components/bricks/Card/Card.selectors");
const { TEST_ID: TEST_ID_TABS } = require("@ppb/the-wall-web/components/walls/TabsGroup/TabsGroup.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class CardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get icon() {
    return this.element.$(ICON);
  }

  get tabs() {
    return this.element.$(TEST_ID_TABS);
  }

  get content() {
    return this.element.$(CONTENT);
  }

  get header() {
    return this.element.$(HEADER);
  }

  get endElement() {
    return this.element.$(END_ELEMENT);
  }

  get headerWrapper() {
    return this.element.$('div[role="button"]');
  }

  get exchangeMarket() {
    return this.element.$(EXCHANGE_MARKET);
  }

  get sportsbookMarket() {
    return this.element.$(SPORTSBOOK_MARKET);
  }

  get inlineSportsbookMarket() {
    return this.element.$(INLINE_SPORTSBOOK_MARKET);
  }
};
