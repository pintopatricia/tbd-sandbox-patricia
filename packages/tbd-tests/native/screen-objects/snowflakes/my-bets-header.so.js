const {
  MY_BETS_HEADER,
  MY_BETS_HEADER_ORDER_STATUS_FILTER,
  MY_BETS_HEADER_ORDER_TYPE_FILTER,
} = require("@ppb/tbd-shared/components/MyBetsPage/snowflakes/MyBetsHeader/MyBetsHeader.native.selectors");

const { PAGE_HEADER_TITLE } = require("@ppb/the-wall-native/components/PageHeader/PageHeader.selectors");

const { BaseSO } = require("@ppb/wdio-lazy-element");

class MyBetsHeaderSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MY_BETS_HEADER}`));
  }

  get title() {
    return this.element.$(`~${PAGE_HEADER_TITLE}`);
  }

  get orderTypeFilter() {
    return this.element.$(`~${MY_BETS_HEADER_ORDER_TYPE_FILTER}`);
  }

  get orderStatusFilter() {
    return this.element.$(`~${MY_BETS_HEADER_ORDER_STATUS_FILTER}`);
  }
}

module.exports = MyBetsHeaderSO;
