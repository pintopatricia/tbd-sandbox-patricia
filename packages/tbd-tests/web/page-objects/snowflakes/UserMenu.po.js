const { TEST_ID } = require("@ppb/tbd-shared/components/UserProfile/snowflakes/UserMenu/UserMenu.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class UserMenuPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = UserMenuPO;
