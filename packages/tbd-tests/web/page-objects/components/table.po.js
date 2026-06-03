const { TEST_ID, HEADER_LABELS, CELLS } = require("@ppb/the-wall-web/components/bricks/Table/Table.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class TablePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get headerLabels() {
    return this.element.$(HEADER_LABELS);
  }

  get cells() {
    return this.element.$(CELLS);
  }
};
