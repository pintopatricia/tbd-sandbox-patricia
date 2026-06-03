const { TEST_ID } = require("@ppb/the-wall-web/components/bricks/Divider/Divider.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class DividerPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = DividerPO;
