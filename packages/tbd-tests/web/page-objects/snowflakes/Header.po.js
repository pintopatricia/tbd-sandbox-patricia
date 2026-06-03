const {
  TEST_ID,
  LOGO,
  LOGO_CONTAINER,
  BALANCE_BUTTON,
  BALANCE_LABEL,
  GENEROSITY_WALLET_BUTTON,
  BALANCE_ICON,
  BACK_BUTTON,
  BACK_BUTTON_ICON,
  JOIN_NOW_BUTTON,
  LOGIN_BUTTON,
  MENU_BUTTON,
} = require("@ppb/tbd-shared/components/Header/snowflakes/Header/Header.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

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
  get logo() {
    return this.element.$(LOGO);
  }

  /**
   * Gets the header logo container
   * @return {HTMLElement} The header logo container
   */
  get logoContainer() {
    return this.element.$(LOGO_CONTAINER);
  }

  /**
   * Gets the header balance button
   * @return {HTMLElement} The header balance button
   */
  get balanceButton() {
    return this.element.$(BALANCE_BUTTON);
  }

  /**
   * Gets the header balance icon
   * @return {HTMLElement} The header balance icon
   */
  get balanceIcon() {
    return this.element.$(BALANCE_ICON);
  }

  /**
   * Gets the header balance label
   * @return {HTMLElement} The header balance label
   */
  get balanceLabel() {
    return this.element.$(BALANCE_LABEL);
  }

  /**
   * Gets the header generosity balance button
   * @return {HTMLElement} The header generosity balance button
   */
  get generosityWalletButton() {
    return this.element.$(GENEROSITY_WALLET_BUTTON);
  }

  /**
   * Gets the header back button
   * @return {HTMLElement} The header back button
   */
  get backButton() {
    return this.element.$(BACK_BUTTON);
  }

  /**
   * Gets the header back button icon
   * @return {HTMLElement} The header back button icon
   */
  get backButtonIcon() {
    return this.element.$(BACK_BUTTON_ICON);
  }

  /**
   * Returns the `Login` Button element
   * @return {HTMLElement} The login button
   */
  get loginButton() {
    return this.element.$(LOGIN_BUTTON);
  }

  /**
   * Returns the `Join Now` Button element
   * @return {HTMLElement} The join now button
   */
  get joinNowButton() {
    return this.element.$(JOIN_NOW_BUTTON);
  }

  get menuButton() {
    return this.element.$(MENU_BUTTON);
  }
};
