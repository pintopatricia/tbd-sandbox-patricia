const { TEST_ID, ICON } = require("@ppb/the-wall-web/components/bricks/HighlightedFrame/HighlightedFrame.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class HighlightedFramePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get icon() {
    return this.element.$(ICON);
  }
};
