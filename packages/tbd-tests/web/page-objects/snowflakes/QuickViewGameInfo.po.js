const {
  TEST_ID,
  MODAL,
  MODAL_HEADER,
  CLOSE_BUTTON,
  MODAL_HEADER_SCROLLED,
  MODAL_TITLE,
  CONTAINER,
  MODAL_FOOTER,
} = require("@ppb/tbd-shared/components/GameCard/components/QuickViewGameInfo.web.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class QuickViewGameInfoPO extends BasePO {
  /**
   * Creates a Game Info page object instance
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the overlay modal
   * @return {HTMLElement} The how to play details
   */
  get overlayModal() {
    return this.element.$(MODAL);
  }

  /**
   * Gets the modal header
   * @return {HTMLElement} The modal header
   */
  get overlayTTitle() {
    return this.element.$(MODAL_HEADER);
  }

  /**
   * Gets the close button of modal
   * @return {HTMLElement} The close button of modal
   */
  get overlayCloseButton() {
    return this.element.$(CLOSE_BUTTON);
  }

  /**
   * Gets the modal header scrolled
   * @return {HTMLElement} The modal header scrolled
   */
  get overlayHeaderAfterScroll() {
    return this.element.$(MODAL_HEADER_SCROLLED);
  }

  /**
   * Gets the modal title
   * @return {HTMLElement} The modal title
   */
  get overlayTitle() {
    return this.element.$(MODAL_TITLE);
  }

  /**
   * Gets the modal container
   * @return {HTMLElement} The game modal container
   */
  get overlayContent() {
    return this.element.$(CONTAINER);
  }

  /**
   * Gets the modal footer
   * @return {HTMLElement} The modal footer
   */
  get overlayPlayNowButton() {
    return this.element.$(MODAL_FOOTER);
  }
};
