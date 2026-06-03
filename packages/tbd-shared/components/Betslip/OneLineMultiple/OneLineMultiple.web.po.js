const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, NOTIFICATION, TEXT } = require("./OneLineMultiple.web.selectors");

module.exports = class OneLineMultiplePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get notification() {
    return this.element.$(NOTIFICATION);
  }

  get text() {
    return this.element.$(TEXT);
  }
};
