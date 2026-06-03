const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, DOT, LINE, ENTRY_TEXT, DESCRIPTION } = require("./BubbleItem.web.selectors");

class BubbleItemPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get dot() {
    return this.element.$(DOT);
  }

  get line() {
    return this.element.$(LINE);
  }

  get entryText() {
    return this.element.$(ENTRY_TEXT);
  }

  get description() {
    return this.element.$(DESCRIPTION);
  }
}

module.exports = BubbleItemPO;
