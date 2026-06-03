const { BaseSO } = require("@ppb/wdio-lazy-element");

const { MULTI_LINES_MULTIPLES, MULTIPLE } = require("./MultiLinesMultiples.native.selectors");

class MultiLinesMultiplesSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MULTI_LINES_MULTIPLES}`));
  }

  get multiples() {
    return this.element.$$(`~${MULTIPLE}`);
  }
}

module.exports = MultiLinesMultiplesSO;
