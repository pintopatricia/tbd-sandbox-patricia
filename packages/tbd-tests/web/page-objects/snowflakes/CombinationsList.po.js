const {
  TEST_ID,
  HEADER,
  MORE,
  HEADER_TITLE,
} = require("@ppb/tbd-shared/components/Betslip/Preview/snowflakes/CombinationsList/CombinationsList.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class CombinationsListPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get header() {
    return this.element.$(HEADER);
  }

  get headerTitle() {
    return this.element.$(HEADER_TITLE);
  }

  get more() {
    return this.element.$(MORE);
  }
};
