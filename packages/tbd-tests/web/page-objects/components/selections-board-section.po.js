const {
  LABEL,
  TEST_ID,
} = require("@ppb/the-wall-web/components/rooms/SelectionsBoard/SelectionsBoardSection.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SelectionsBoardSectionPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get label() {
    return this.element.$(LABEL);
  }
}

module.exports = SelectionsBoardSectionPO;
