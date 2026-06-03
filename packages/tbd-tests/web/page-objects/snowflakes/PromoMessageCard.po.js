const { TEST_ID: ALERT } = require("@ppb/the-wall-web/components/bricks/Alert/Alert.selectors");
const {
  TEST_ID,
  INFO_TEXT,
  BUTTON,
} = require("@ppb/tbd-shared/components/ImsPromotionErrorCard/snowflakes/PromoMessageCard/PromoMessageCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PromoMessagePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the notification component
   * @return {HTMLElement} The notification component
   */
  get notification() {
    return this.element.$(ALERT);
  }

  /**
   * Gets the promo info text
   * @return {HTMLElement} The info text element
   */
  get infoText() {
    return this.element.$(INFO_TEXT);
  }

  /**
   * Gets the promo button
   * @return {HTMLElement} The button element
   */
  get button() {
    return this.element.$(BUTTON);
  }
}

module.exports = PromoMessagePO;
