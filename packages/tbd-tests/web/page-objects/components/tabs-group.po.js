const tabStyles = require("@ppb/the-wall-web/components/bricks/SingleTab/SingleTab.modules.json");
const { TEST_ID, TABS } = require("@ppb/the-wall-web/components/walls/TabsGroup/TabsGroup.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class TabsGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get tabs() {
    return this.element.$$(TABS);
  }

  get selectedTab() {
    return this.element.$(tabStyles.tabSelected);
  }
}

module.exports = TabsGroupPO;
