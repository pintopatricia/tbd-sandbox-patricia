const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, TITLE, QUICKLINK_LINK } = require("./all-competitions-page.selectors");

module.exports = class AllCompetitionsPagePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get links() {
    return this.element.$$(QUICKLINK_LINK);
  }
};
