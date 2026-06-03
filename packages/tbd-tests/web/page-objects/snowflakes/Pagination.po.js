const { TEST_ID, DOTS } = require("@ppb/the-wall-web/components/bricks/Pagination/Pagination.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PaginationPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  static get states() {
    return {
      selected: "Selected",
    };
  }

  get dots() {
    return this.element.$$(DOTS);
  }
}

module.exports = PaginationPO;
