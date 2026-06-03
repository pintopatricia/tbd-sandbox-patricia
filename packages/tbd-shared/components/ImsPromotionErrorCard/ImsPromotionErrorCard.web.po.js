const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, BUTTON, TEXT, NOTIFICATION } = require("./ImsPromotionErrorCard.web.selectors");

class ImsPromotionErrorCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the notification
   * @return {HTMLElement} The notification component
   */
  get notification() {
    return this.element.$(NOTIFICATION);
  }

  /**
   * Gets the text
   * @return {HTMLElement} The ims promo error message card text
   */
  get text() {
    return this.element.$(TEXT);
  }

  /**
   * Gets the button
   * @return {HTMLElement} The button component
   */
  get button() {
    return this.element.$(BUTTON);
  }
}

module.exports = ImsPromotionErrorCardPO;
