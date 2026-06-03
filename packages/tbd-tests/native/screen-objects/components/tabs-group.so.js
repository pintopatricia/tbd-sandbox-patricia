const { TABS_CONTAINER } = require("@ppb/the-wall-native/components/TabsGroup/TabsGroup.selectors");
const {
  TAB_ICON,
  TAB_TITLE,
  TAB_SELECTED,
} = require("@ppb/the-wall-native/components/TabsGroup/TabsGroupTitle/TabsGroupTitle.selectors");
const {
  TAB_BUTTON,
} = require("@ppb/the-wall-native/components/TabsGroup/TabsGroupPressable/TabsGroupPressable.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class TabsGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TABS_CONTAINER}`));
  }

  get tabButtons() {
    return this.element.$$(`~${TAB_BUTTON}`);
  }

  get tabsIcons() {
    return this.element.$$(`~${TAB_ICON}`);
  }

  get tabsTitles() {
    return this.element.$$(`~${TAB_TITLE}`);
  }

  get selectedTab() {
    return this.element.$(`~${TAB_SELECTED}`).$(`~${TAB_TITLE}`);
  }
}

module.exports = TabsGroupSO;
