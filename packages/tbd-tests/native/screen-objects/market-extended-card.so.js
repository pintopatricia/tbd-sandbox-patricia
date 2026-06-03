const { RUNNER } = require("@ppb/the-wall-native/components/Runner/Runner.selectors");
const { SHOW_MORE } = require("@ppb/the-wall-native/components/bricks/ShowMore/ShowMore.selectors");
const {
  MARKET_EXTENDED,
  MARKET_EXTENDED_TITLE,
} = require("@ppb/tbd-shared/components/MarketExtendedCard/MarketExtendedCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class MarketExtendedCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MARKET_EXTENDED}`));
  }

  get title() {
    return this.element.$(`~${MARKET_EXTENDED_TITLE}`);
  }

  get showMore() {
    return this.element.$(`~${SHOW_MORE}`);
  }

  get runners() {
    return this.element.$$(`~${RUNNER}`);
  }
}

module.exports = MarketExtendedCardSO;
