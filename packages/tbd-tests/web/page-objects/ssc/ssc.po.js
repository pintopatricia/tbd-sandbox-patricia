const { BasePO } = require("@ppb/wdio-lazy-element");

const TEST_ID = "#ssc-header-container";

module.exports = class HeaderPO extends BasePO {
  /**
   * Creates an header page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the header logo
   * @return {HTMLElement} The header logo
   */

  get myAccount() {
    return this.element.$("//a[span[contains(text(), 'My Account')]]");
  }

  get myRewards() {
    return this.element.$(".ssc-mbn");
  }

  get myHelp() {
    return this.element.$("a*=Help");
  }

  get myDeposit() {
    return this.element.$("a*=Deposit");
  }

  get myMainWallet() {
    return this.element.$("td[rel='main']");
  }

  get myAccountMenu() {
    return this.element.$(".ssc-myal");
  }

  get logoutButton() {
    return this.element.$(".ssc-myalo input[type='submit']");
  }

  get signUpButton() {
    return this.element.$('a[title*="Sign Up"], a[title*="Join"]');
  }

  get logInButton() {
    return this.element.$(".ssc-lib");
  }
};
