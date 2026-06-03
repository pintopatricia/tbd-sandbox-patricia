const {
  USER_PROFILE_HEADER,
  TITLE,
  CLOSE,
  BACK,
  BALANCE,
  FREE_BETS_BALANCE,
} = require("@ppb/tbd-shared/components/UserProfileHeader/snowflakes/UserProfileHeader/UserProfileHeader.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class UserProfileHeaderPO extends BasePO {
  /**
   * Creates an header page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(USER_PROFILE_HEADER));
  }

  /**
   * Gets the header title
   * @return {HTMLElement} The header title
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the header back button
   * @return {HTMLElement} The header back button
   */
  get backButton() {
    return this.element.$(BACK);
  }

  /**
   * Gets the header close button
   * @return {HTMLElement} The header close button
   */
  get closeButton() {
    return this.element.$(CLOSE);
  }

  /**
   * Gets the header balance label
   * @return {HTMLElement} The header balance label
   */
  get balanceLabel() {
    return this.element.$(BALANCE);
  }

  /**
   * Gets the header free bets balance label
   * @return {HTMLElement} The header free bets balance label
   */
  get freeBetsBalanceLabel() {
    return this.element.$(FREE_BETS_BALANCE);
  }
};
