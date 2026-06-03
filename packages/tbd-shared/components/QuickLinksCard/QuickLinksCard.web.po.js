const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, TITLE, QUICKLINK } = require("./QuickLinksCard.web.selectors");

module.exports = class QuickLinksCard extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get quicklinks() {
    return this.element.$$(QUICKLINK);
  }
};
