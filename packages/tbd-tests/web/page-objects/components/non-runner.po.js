const {
  TITLE,
  TEST_ID,
  DATE,
  REDUCTION,
} = require("@ppb/the-wall-web/components/bricks/NonRunner/NonRunner.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class NonRunner extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get date() {
    return this.element.$(DATE);
  }

  get reduction() {
    return this.element.$(REDUCTION);
  }
};
