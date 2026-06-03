const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID: COLLAPSE, HEADER, HEADER_TITLE, HEADER_ICON, ITEM } = require("./BetInfoCollapse.web.selectors");

module.exports = class BetInfoCollapsePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(COLLAPSE));
  }

  get header() {
    return this.element.$(HEADER);
  }

  get headerTitle() {
    return this.header.$(HEADER_TITLE);
  }

  get headerIcon() {
    return this.header.$(HEADER_ICON);
  }

  get items() {
    return this.element.$$(ITEM);
  }
};
