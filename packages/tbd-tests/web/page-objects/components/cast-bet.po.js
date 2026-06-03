const { TEST_ID, TITLE } = require("@ppb/the-wall-web/components/rooms/CastBet/CastBet.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class CastBetPo extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }
}

module.exports = CastBetPo;
