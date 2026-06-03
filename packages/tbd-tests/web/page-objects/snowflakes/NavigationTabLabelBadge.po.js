const {
  TEST_ID,
} = require("@ppb/the-wall-web/components/bricks/NavigationTabLabelBadge/NavigationTabLabelBadge.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class NavigationTabLabelBadgePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = NavigationTabLabelBadgePO;
