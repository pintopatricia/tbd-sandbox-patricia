const {
  TEST_ID,
  ICON,
  TEXT,
} = require("@ppb/the-wall-web/components/walls/NavigationTabLabel/NavigationTabLabel.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class NavigationTabLabelPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get icon() {
    return this.element.$(ICON);
  }

  get text() {
    return this.element.$(TEXT);
  }
}

module.exports = NavigationTabLabelPO;
