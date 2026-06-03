const {
  TEST_ID,
  TITLE,
  GROUP_SECTIONS,
  QUICK_MENU_BUTTONS_LIST,
  QUICK_MENU_REDIRECT_LIST,
  LOG_OUT_BUTTON_LINK,
  ACCOUNT_DETAILS_SECTION,
  MY_WALLET_SECTION,
  BETTING_ACTIVITY_SECTION,
  PROMOTIONS_SECTION,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/UserProfile/UserProfile.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class UserProfilePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  /**
   * ACCOUNT_DETAILS_SECTION selector is dynamic, based on the title of that section.
   * If the translation changes, the selector also needs to be changed
   */
  get accountDetailsSection() {
    return this.element.$(ACCOUNT_DETAILS_SECTION);
  }

  /**
   * MY_WALLET_SECTION selector is dynamic, based on the title of that section.
   * If the translation changes, the selector also needs to be changed
   */
  get myWalletSection() {
    return this.element.$(MY_WALLET_SECTION);
  }

  /**
   * BETTING_ACTIVITY selector is dynamic, based on the title of that section.
   * If the translation changes, the selector also needs to be changed
   */
  get bettingActivitySection() {
    return this.element.$(BETTING_ACTIVITY_SECTION);
  }

  /**
   * PROMOTIONS selector is dynamic, based on the title of that section.
   * If the translation changes, the selector also needs to be changed
   */
  get promotionsSection() {
    return this.element.$(PROMOTIONS_SECTION);
  }

  get groupSections() {
    return this.element.$$(GROUP_SECTIONS);
  }

  get quickMenuList() {
    return this.element.$$(QUICK_MENU_BUTTONS_LIST);
  }

  get quickMenuRedirectList() {
    return this.element.$$(QUICK_MENU_REDIRECT_LIST);
  }

  get logOutButtonLink() {
    return this.element.$(LOG_OUT_BUTTON_LINK);
  }
}

module.exports = UserProfilePO;
