const {
  TEST_ID,
  TITLE,
  AVAILABLE_FUNDS,
  SUB_HEADER,
  BUTTON,
} = require("@ppb/tbd-shared/components/ImsPromotionStateCard/snowflakes/ClaimNowPromo/ClaimNowPromo.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ClaimNowPromoPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the tile
   * @return {HTMLElement} The claim now promo card tile
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the available funds
   * @return {HTMLElement} The claim now promo card available funds
   */
  get availableFunds() {
    return this.element.$(AVAILABLE_FUNDS);
  }

  /**
   * Gets the sub header
   * @return {HTMLElement} The claim now promo card sub header
   */
  get subHeader() {
    return this.element.$(SUB_HEADER);
  }

  /**
   * Gets action button
   * @return {HTMLElement} The claim now promo card action button
   */
  get button() {
    return this.element.$(BUTTON);
  }
}

module.exports = ClaimNowPromoPO;
