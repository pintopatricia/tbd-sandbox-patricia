const { BasePO } = require("@ppb/wdio-lazy-element");
const tabStyles = require("@ppb/the-wall-web/components/bricks/SingleTab/SingleTab.modules.json");

const { TEST_ID, TAB_BUTTON, TAB_ITEM, TAB_NO_CONTENT } = require("./NavigationTabsList.web.selectors");

module.exports = class NavigationTabsList extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  static get states() {
    return {
      selected: tabStyles.tabSelected.replace(".", ""),
    };
  }

  get tabs() {
    return this.element.$$(TAB_BUTTON);
  }

  get tabItems() {
    return this.element.$$(TAB_ITEM);
  }

  get tabNoContent() {
    return this.element.$(TAB_NO_CONTENT);
  }
};
