const {
  BET_BUILDER_SUMMARY,
  TITLE,
  SELECTIONS,
  SUMMARY,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookReceipt/snowflakes/SportsbookReceiptPanel/snowflakes/BetBuilderSummary/BetBuilderSummary.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetBuilderSO extends BaseSO {
  /**
   * Creates a multiples card page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${BET_BUILDER_SUMMARY}`));
  }

  get title() {
    return this.element.$(`~${TITLE}`);
  }

  get selections() {
    return this.element.$(`~${SELECTIONS}`);
  }

  get summary() {
    return this.element.$(`~${SUMMARY}`);
  }
}

module.exports = BetBuilderSO;
