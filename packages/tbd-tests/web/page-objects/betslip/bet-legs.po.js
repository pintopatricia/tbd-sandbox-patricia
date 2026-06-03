const {
  TEST_ID: BET_SELECTION_DETAIL,
} = require("@ppb/the-wall-web/components/walls/BetSelectionDetails/BetSelectionDetails.selectors");
const {
  TEST_ID,
  HEADER_TITLE,
  HEADER,
  DESCRIPTION,
} = require("@ppb/tbd-shared/components/Betslip/BetLegs/BetLegs.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BetLegsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get headerTitle() {
    return this.element.$(HEADER_TITLE);
  }

  get header() {
    return this.element.$(HEADER);
  }

  get selections() {
    return this.element.$$(BET_SELECTION_DETAIL);
  }

  get description() {
    return this.element.$(DESCRIPTION);
  }
}

module.exports = BetLegsPO;
