const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, RUNNERS } = require("./GridCard.web.selectors");

module.exports = class GridCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get runners() {
    return this.element.$$(RUNNERS);
  }
};
