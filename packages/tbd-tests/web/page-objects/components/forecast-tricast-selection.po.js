const {
  TEST_ID,
  SUPPORT_LABEL,
  LABEL,
  SILK,
} = require("@ppb/the-wall-web/components/bricks/ForecastTricastSelection/ForecastTricastSelection.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ForecastTricastSelectionPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get positionNumber() {
    return this.element.$(SUPPORT_LABEL);
  }

  get horse() {
    return this.element.$(LABEL);
  }

  get silk() {
    return this.element.$(SILK);
  }
}

module.exports = ForecastTricastSelectionPO;
