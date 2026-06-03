const {
  SCROLLABLE_SWIMLANE_TITLE,
} = require("@ppb/the-wall-native/components/ScrollableSwimlane/ScrollableSwimlane.selectors");
const {
  INLINE_EXCHANGE_MARKET,
  SNAP_GROUP,
  BET_BUTTON_VIEW,
} = require("@ppb/tbd-shared/components/ExchangeMarket/snowflakes/InlineExchangeMarket/InlineExchangeMarket.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class InlineExchangeMarketSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${INLINE_EXCHANGE_MARKET}`));
  }

  /**
   * Returns the snap groups of the inline market
   * Uses the `SNAP_GROUP` selector
   */
  get snapGroups() {
    return this.element.$$(`~${SNAP_GROUP}`);
  }

  get betButtons() {
    return this.element.$$(`~${BET_BUTTON_VIEW}`);
  }

  get scrollableSwimlaneTitle() {
    return this.element.$(`~${SCROLLABLE_SWIMLANE_TITLE}`);
  }
}

module.exports = InlineExchangeMarketSO;
