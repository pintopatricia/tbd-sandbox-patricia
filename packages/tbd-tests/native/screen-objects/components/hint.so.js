const { HINT, HINT_MESSAGE, HINT_TYPE } = require("@ppb/the-wall-native/components/Hint/Hint.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class HintSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${HINT}`));
  }

  /**
   * Returns the Hint `message` nativeElement
   * Uses the `HINT_MESSAGE` selector
   */
  get message() {
    return this.element.$(`~${HINT_MESSAGE}`);
  }

  /**
   * Returns the Hint `type` nativeElement
   * Uses the `HINT_TYPE` selector
   */
  get type() {
    return this.element.$(`~${HINT_TYPE}`);
  }
}

module.exports = HintSO;
