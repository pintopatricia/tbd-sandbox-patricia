const {
  TAB_LABEL_BADGE,
} = require("@ppb/the-wall-native/components/TabsGroup/NavigationTabLabelBadge/NavigationTabLabelBadge.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class NavigationTabLabelBadgeSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(TAB_LABEL_BADGE));
  }
}

module.exports = NavigationTabLabelBadgeSO;
