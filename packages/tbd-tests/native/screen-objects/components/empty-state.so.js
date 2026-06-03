const {
  TEST_ID,
  TITLE,
  MESSAGE,
  DEFAULT_IMAGE_HOLDER,
  IMAGE_HOLDER,
} = require("@ppb/the-wall-native/components/EmptyState/EmptyState.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class EmptyStateSO extends BaseSO {
  /**
   * Creates a secondary event card page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  /**
   * @return {HTMLElement} The title
   */
  get title() {
    return this.element.$(`~${TITLE}`);
  }

  /**
   * @return {HTMLElement} The message
   */
  get message() {
    return this.element.$(`~${MESSAGE}`);
  }

  /**
   * Gets the Image Holder of the view
   * @return {HTMLElement} The image holder
   */
  get image() {
    return this.element.$(`~${IMAGE_HOLDER}`);
  }

  /**
   * Gets the Default Image Holder of the view
   * @return {HTMLElement} The default image holder
   */
  get defaultImage() {
    return this.element.$(`~${DEFAULT_IMAGE_HOLDER}`);
  }
};
