const {
  TITLE,
  ICON,
} = require("@ppb/the-wall-web/components/bricks/SupportingContentButton/SupportingContentButton.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID } = require("./broadcasts.selectors");

module.exports = class BroadcastsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get icon() {
    return this.element.$(ICON);
  }

  get title() {
    return this.element.$(TITLE);
  }
};
