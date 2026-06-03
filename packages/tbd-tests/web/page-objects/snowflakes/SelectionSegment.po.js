const {
  TEST_ID,
  TERM,
  VALUE_CONTAINER,
} = require("@ppb/the-wall-web/components/bricks/BetSegments/SelectionSegment/SelectionSegment.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SelectionSegmentPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get term() {
    return this.element.$(TERM);
  }

  get valueContainer() {
    return this.element.$(VALUE_CONTAINER);
  }
}

module.exports = SelectionSegmentPO;
