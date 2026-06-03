const { TABS_CONTAINER } = require("@ppb/the-wall-native/components/TabsGroup/TabsGroup.selectors");
const {
  CARD,
  CARD_TITLE,
  CARD_CONTENT,
  CARD_HEADER,
  CARD_END_ELEMENT,
} = require("@ppb/the-wall-native/components/Card/Card.selectors");
const {
  EXCHANGE_MARKET,
} = require("@ppb/tbd-shared/components/ExchangeMarket/snowflakes/ExchangeMarket/ExchangeMarket.native.selectors");
const { SPORTSBOOK_MARKET } = require("@ppb/the-wall-native/components/SportsbookMarket/SportsbookMarket.selectors");
const {
  INLINE_SPORTSBOOK_MARKET,
} = require("@ppb/the-wall-native/components/Markets/InlineSportsbookMarket/InlineSportsbookMarket.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class CardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${CARD}`));
  }

  get title() {
    return this.element.$(`~${CARD_TITLE}`);
  }

  get header() {
    return this.element.$(`~${CARD_HEADER}`);
  }

  get endElement() {
    return this.element.$(`~${CARD_END_ELEMENT}`);
  }

  get contentWrapper() {
    return this.element.$(`~${CARD_CONTENT}`);
  }

  get tabs() {
    return this.element.$(`~${TABS_CONTAINER}`);
  }

  get exchangeMarket() {
    return this.element.$(`~${EXCHANGE_MARKET}`);
  }

  get sportsbookMarket() {
    return this.element.$(`~${SPORTSBOOK_MARKET}`);
  }

  get inlineSportsbookMarket() {
    return this.element.$(`~${INLINE_SPORTSBOOK_MARKET}`);
  }
};
