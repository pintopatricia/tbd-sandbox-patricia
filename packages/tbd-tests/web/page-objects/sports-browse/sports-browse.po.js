const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, QUICKLINK_LINKS, QUICKLINKS, QUICKLINK } = require("./sports-browse.selectors");

module.exports = class BrowsePagePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get quicklinks() {
    return this.element.$(QUICKLINKS);
  }

  get quicklinkLinks() {
    return this.element.$$(QUICKLINK_LINKS);
  }

  get quickLinksItems() {
    return this.element.$$(QUICKLINK);
  }
};
