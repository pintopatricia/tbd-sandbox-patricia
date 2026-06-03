const {
  TEST_ID,
  BUTTON,
  TITLE,
  TANDC,
} = require("@ppb/tbd-shared/components/ImsPromotionStateCard/snowflakes/AcceptPromoCard/AcceptPromoCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class AcceptPromoCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the title
   * @return {HTMLElement} The promo card title
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Gets terms and conditions
   * @return {HTMLElement} The promo terms and conditions
   */
  get termsAndConditions() {
    return this.element.$(TANDC);
  }

  /**
   * Gets action button
   * @return {HTMLElement} The promo card action button
   */
  get button() {
    return this.element.$(BUTTON);
  }
}

module.exports = AcceptPromoCardPO;
