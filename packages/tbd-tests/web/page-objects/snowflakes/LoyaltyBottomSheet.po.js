const {
  TEST_ID,
  HEADER,
  HEADER_TITLE,
  CLOSE_BUTTON,
  IFRAME,
  FRAME_CONTENT,
} = require("@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/LoyaltyPromoCard.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class LoyaltyBottomSheetPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the webElement of the root element for loyalty bottom sheet
   * Uses the `TEST_ID` selector
   */
  get root() {
    return this.element.$(TEST_ID);
  }

  /**
   * Returns the webElement of the title for loyalty bottom sheet container
   * Uses the `HEADER` selector
   */
  get header() {
    return this.element.$(HEADER);
  }

  /**
   * Returns the webElement of the header title for loyalty bottom sheet container
   * Uses the `HEADER_TITLE` selector
   */
  get headerTitle() {
    return this.element.$(HEADER_TITLE);
  }

  /**
   * Returns the webElement of the Close button element for loyalty bottom sheet container
   * Uses the `CLOSE_BUTTON` selector
   */
  get closeButton() {
    return this.element.$(CLOSE_BUTTON);
  }

  /**
   * Returns the webElement of the Iframe element for loyalty bottom sheet container
   * Uses the `IFRAME` selector
   */
  get iframe() {
    return this.element.$(IFRAME);
  }

  /**
   * Returns the webElement of the Frame Content element for loyalty bottom sheet container
   * Uses the `FRAME_CONTENT` selector
   */
  get frameContent() {
    return this.element.$(FRAME_CONTENT);
  }
}

module.exports = LoyaltyBottomSheetPO;
