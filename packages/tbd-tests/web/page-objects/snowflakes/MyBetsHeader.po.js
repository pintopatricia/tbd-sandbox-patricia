const {
  TEST_ID,
  TITLE,
  ORDER_TYPE_FILTER,
  ORDER_STATUS_FILTER,
  HEADER,
} = require("@ppb/tbd-shared/components/MyBetsPage/snowflakes/MyBetsHeader/MyBetsHeader.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class MyBetsHeaderPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get orderTypeFilter() {
    return this.element.$(ORDER_TYPE_FILTER);
  }

  get orderStatusFilter() {
    return this.element.$(ORDER_STATUS_FILTER);
  }

  get header() {
    return this.element.$(HEADER);
  }
}

module.exports = MyBetsHeaderPO;
