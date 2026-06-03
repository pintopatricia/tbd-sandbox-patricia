const { TEST_ID, FILTER, RESET_BUTTON } = require("@ppb/the-wall-web/components/walls/FilterBy/FilterBy.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class FilterByPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get filters() {
    return this.element.$$(FILTER);
  }

  get resetButton() {
    return this.element.$(RESET_BUTTON);
  }
}

module.exports = FilterByPO;
