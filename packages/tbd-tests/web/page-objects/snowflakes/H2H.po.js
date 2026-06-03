const {
  TEST_ID,
  DATE_CONTANER,
} = require("@ppb/tbd-components-rich-data/components/StatsHeadToHeadCard/view/snowflakes/H2H/H2H.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class H2HPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get dateContainer() {
    return this.element.$(DATE_CONTANER);
  }
};
