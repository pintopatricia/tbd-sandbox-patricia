const {
  TEST_ID,
  HEADER_TITLE,
  HEADER,
  CONTENT,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookReceipt/snowflakes/SportsbookReceiptPanel/snowflakes/BetSelections/BetSelections.web.selectors");
const {
  TEST_ID: BET_SELECTION_DETAIL,
} = require("@ppb/the-wall-web/components/walls/BetSelectionDetails/BetSelectionDetails.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BetSelectionsPO extends BasePO {
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

  get content() {
    return this.element.$(CONTENT);
  }
}

module.exports = BetSelectionsPO;
