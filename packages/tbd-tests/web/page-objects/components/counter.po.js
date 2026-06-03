const { TEST_ID } = require("@ppb/the-wall-web/components/bricks/Counter/Counter.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class CounterPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = CounterPO;
