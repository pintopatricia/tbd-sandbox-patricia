const { BaseSO } = require("@ppb/wdio-lazy-element");

const { ONE_LINE_MULTIPLE, NOTIFICATION, TEXT } = require("./OneLineMultiple.native.selectors");

class OneLineMultipleSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${ONE_LINE_MULTIPLE}`));
  }

  get notification() {
    return this.element.$(`~${NOTIFICATION}`);
  }

  get text() {
    return this.element.$(`~${TEXT}`);
  }
}

module.exports = OneLineMultipleSO;
