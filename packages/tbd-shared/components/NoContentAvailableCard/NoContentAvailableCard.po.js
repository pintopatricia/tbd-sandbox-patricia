const { BasePO } = require("@ppb/wdio-lazy-element");

const { TEST_ID, NO_CONTENT_FIRST_LABEL, NO_CONTENT_SECOND_LABEL } = require("./NoContentAvailableCard.web.selectors");

module.exports = class NoContentAvailableCard extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get firstLabel() {
    return this.element.$(NO_CONTENT_FIRST_LABEL);
  }

  get secondLabel() {
    return this.element.$(NO_CONTENT_SECOND_LABEL);
  }
};
