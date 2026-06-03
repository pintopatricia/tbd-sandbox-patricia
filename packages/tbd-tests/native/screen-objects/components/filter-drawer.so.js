const { FILTER_DRAWER_ID } = require("@ppb/the-wall-native/components/Drawer/FilterDrawer/FilterDrawer.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class FilterDrawerSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${FILTER_DRAWER_ID}`));
  }
}

module.exports = FilterDrawerSO;
