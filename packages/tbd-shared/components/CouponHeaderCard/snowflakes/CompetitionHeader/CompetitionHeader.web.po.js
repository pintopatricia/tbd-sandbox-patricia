const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID } = require("./CompetitionHeader.web.selectors");

class CollapsePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = CollapsePO;
