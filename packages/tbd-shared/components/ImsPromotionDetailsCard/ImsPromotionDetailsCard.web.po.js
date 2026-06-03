const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, TITLE, TEXT } = require("./ImsPromotionDetailsCard.web.selectors");

class ImsPromotionDetailsCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the title
   * @return {HTMLElement} The ims promo details card title
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the text
   * @return {HTMLElement} The ims promo details card text
   */
  get text() {
    return this.element.$(TEXT);
  }
}

module.exports = ImsPromotionDetailsCardPO;
