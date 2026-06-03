const {
  TEST_ID,
  MENU_ITEM,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/UserQuickMenu/UserQuickMenu.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class UserQuickMenuPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get quickMenuItems() {
    return this.element.$$(MENU_ITEM);
  }
}

module.exports = UserQuickMenuPO;
