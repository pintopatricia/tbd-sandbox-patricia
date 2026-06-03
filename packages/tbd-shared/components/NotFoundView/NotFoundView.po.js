const { BasePO } = require("@ppb/wdio-lazy-element");

const { TEST_ID, LINKS_CONTAINER, LINK } = require("./NotFoundView.web.selectors");

module.exports = class NotFoundViewPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get linkContainer() {
    return this.element.$$(LINKS_CONTAINER);
  }

  get links() {
    return this.element.$$(LINK);
  }
};
