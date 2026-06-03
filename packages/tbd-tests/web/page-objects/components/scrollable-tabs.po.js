const {
  TEST_ID,
  LEFT_BUTTON,
  RIGHT_BUTTON,
} = require("@ppb/the-wall-web/components/walls/ScrollableTabs/ScrollableTabs.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class ScrollableTabsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get leftButton() {
    return this.element.$(LEFT_BUTTON);
  }

  get rightButton() {
    return this.element.$(RIGHT_BUTTON);
  }
};
