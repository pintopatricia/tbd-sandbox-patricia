const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, TITLE, TEXT } = require("./ImsPromotionTermsAndContidionsCard.web.selectors");

class ImsPromotionTermsAndConditionsCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the title
   * @return {HTMLElement} The ims terms and conditions card title
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the text
   * @return {HTMLElement} The ims terms and conditions card text
   */
  get text() {
    return this.element.$(TEXT);
  }
}

module.exports = ImsPromotionTermsAndConditionsCardPO;
