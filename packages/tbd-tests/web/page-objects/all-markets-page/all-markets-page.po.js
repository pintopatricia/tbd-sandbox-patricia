const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, TITLE, QUICKLINK_LINK } = require("./all-markets-page.selectors");

module.exports = class AllMarketsPagePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get listOfLinks() {
    return this.element.$$(QUICKLINK_LINK);
  }
};
