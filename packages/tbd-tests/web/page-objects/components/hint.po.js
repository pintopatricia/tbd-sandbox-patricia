const { TEST_ID, MESSAGE, TYPE, TYPE_WARNING } = require("@ppb/the-wall-web/components/bricks/Hint/Hint.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class HintPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the Hint `message` webElement
   * Uses the `MESSAGE` selector
   */
  get message() {
    return this.element.$(MESSAGE);
  }

  /**
   * Returns the Hint `type` webElement
   * Uses the `TYPE` selector
   */
  get type() {
    return this.element.$(TYPE);
  }

  /**
   * Returns the Hint `type` webElement when the prop is "Warning"
   * Uses the `TYPE_WARNING` selector
   */
  get typeWarning() {
    return this.element.$(TYPE_WARNING);
  }
}

module.exports = HintPO;
