const {
  TEST_ID,
  TITLE,
  SELECTIONS,
  SUMMARY,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookReceipt/snowflakes/SportsbookReceiptPanel/snowflakes/BetBuilderSummary/BetBuilderSummary.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BetBuilderSummaryPO extends BasePO {
  /**
   * Creates a multiples card page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get selections() {
    return this.element.$(SELECTIONS);
  }

  get summary() {
    return this.element.$(SUMMARY);
  }
}

module.exports = BetBuilderSummaryPO;
