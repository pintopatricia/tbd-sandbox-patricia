const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID } = require("./SportsbookBetCard.web.selectors");

module.exports = class SportsbookBetCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get superSubIconContainer() {
    return this.element.$(TEST_ID);
  }
};
