const { TEST_ID, CONTENT } = require("@ppb/the-wall-web/components/bricks/Selector/Selector.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SelectorPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get selectedValue() {
    return this.element.$(CONTENT);
  }
}

module.exports = SelectorPO;
