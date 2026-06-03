const { TEST_ID, LABEL } = require("@ppb/tbd-shared/components/SearchBarHistory/SearchBarHistory.selectors");
const { TEST_ID: LINK_TEST_ID } = require("@ppb/the-wall-web/components/walls/QuickLink/QuickLink.selectors.js");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SearchBarHistoryPO extends BasePO {
  constructor() {
    super($(TEST_ID));
  }

  get label() {
    return this.element.$(LABEL);
  }

  get historyItems() {
    return this.element.$$(LINK_TEST_ID);
  }
}

module.exports = SearchBarHistoryPO;
