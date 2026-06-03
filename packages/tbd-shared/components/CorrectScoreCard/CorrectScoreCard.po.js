const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, RUNNERS } = require("./CorrectScoreCard.web.selectors");

module.exports = class CorrectScoreCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get runners() {
    return this.element.$$(RUNNERS);
  }
};
