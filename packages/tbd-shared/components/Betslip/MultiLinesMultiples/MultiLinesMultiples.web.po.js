const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, MULTIPLE } = require("./MultiLinesMultiples.web.selectors");

module.exports = class MultiLinesMultiplesPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get multiples() {
    return this.element.$$(MULTIPLE);
  }
};
