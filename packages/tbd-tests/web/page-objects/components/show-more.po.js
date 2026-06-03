const { TEST_ID } = require("@ppb/the-wall-web/components/bricks/ShowMore/ShowMore.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ShowMorePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = ShowMorePO;
