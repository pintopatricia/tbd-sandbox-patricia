const {
  DETAILED_SUMMARY,
  DETAILED_SUMMARY_GROUP_TITLE,
  DETAILED_SUMMARY_ITEM_TITLE,
  DETAILED_SUMMARY_ITEM_AMOUNT,
} = require("@ppb/tbd-shared/components/MarketGraph/MarketGraphContent/snowflakes/DetailedSummary/DetailedSummary.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class DetailedSummarySO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${DETAILED_SUMMARY}`));
  }

  get detailedSummaryGroupTitle() {
    return this.element.$$(`~${DETAILED_SUMMARY_GROUP_TITLE}`);
  }

  get detailedSummaryItemsTitle() {
    return this.element.$$(`~${DETAILED_SUMMARY_ITEM_TITLE}`);
  }

  get detailedSummaryItemsAmount() {
    return this.element.$$(`~${DETAILED_SUMMARY_ITEM_AMOUNT}`);
  }
}

module.exports = DetailedSummarySO;
