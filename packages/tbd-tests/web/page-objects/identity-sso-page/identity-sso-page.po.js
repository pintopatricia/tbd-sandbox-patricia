const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, LOGIN_FORM, LOGIN_USERNAME, LOGIN_PASSWORD, LOGIN_BUTTON } = require("./identity-sso-page.selectors");

/**
 * Class that represents the IdentitySSO Page PO
 *
 */
module.exports = class IdentitySsoPagePO extends BasePO {
  /**
   * Constructor for the IdentitySSo page PO
   * By default it sends the root element as lazyElement
   */
  constructor() {
    super($(TEST_ID));
  }

  /**
   * Getter for the login form Element
   */
  get loginForm() {
    return this.element.$(LOGIN_FORM);
  }

  /**
   * Getter for the form username input
   */
  get username() {
    return this.element.$(LOGIN_USERNAME);
  }

  /**
   * Getter for the form password input
   */
  get password() {
    return this.element.$(LOGIN_PASSWORD);
  }

  /**
   * Getter for the form login button
   */
  get loginButton() {
    return this.element.$(LOGIN_BUTTON);
  }

  /**
   * Makes the login on the identitySso form
   *
   * @param {string} user username
   * @param {string} password password
   */
  async login(user, password) {
    await this.username.setValue(user);
    await this.password.setValue(password);
    await this.loginButton.click();
  }
};
