const { BaseSO } = require("@ppb/wdio-lazy-element");

const { NAVIGATION_TABS_LIST_CONTAINER } = require("./NavigationTabsList.native.selectors");

class NavigationTabsListSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${NAVIGATION_TABS_LIST_CONTAINER}`));
  }
}

module.exports = NavigationTabsListSO;
