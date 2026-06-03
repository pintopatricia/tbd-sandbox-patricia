const { BaseSO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, COLUMN } = require("./CorrectScoreCard.native.selectors");

module.exports = class CorrectScoreCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get columns() {
    return this.element.$$(`~${COLUMN}`);
  }
};
