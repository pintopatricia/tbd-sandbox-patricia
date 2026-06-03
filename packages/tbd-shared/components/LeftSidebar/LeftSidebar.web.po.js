const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, SEARCH_BAR, SEARCH_TITLE, QUICKLINK_CARD_GROUP } = require("./LeftSidebar.web.selectors");

module.exports = class LeftSidebarPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get searchBar() {
    return this.element.$(SEARCH_BAR);
  }

  get searchBarTitle() {
    return this.element.$(SEARCH_TITLE);
  }

  get quicklinksCardGroups() {
    return this.element.$$(QUICKLINK_CARD_GROUP);
  }
};
