const {
  TEST_ID,
  GRID_ITEMS,
} = require("@ppb/tbd-shared/components/ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroup.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class ByTimeRangeMeetingCardGroup extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get gridItems() {
    return this.element.$$(GRID_ITEMS);
  }
};
