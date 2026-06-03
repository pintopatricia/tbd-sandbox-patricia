const {
  BOTTOM_SHEET,
  BOTTOM_SHEET_HEADER,
  BOTTOM_SHEET_HEADER_TITLE,
  BOTTOM_SHEET_CLOSE_BUTTON,
  BOTTOM_SHEET_WEBVIEW,
} = require("@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/LoyaltyPromoCard.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class LoyaltyBottomSheetSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BOTTOM_SHEET}`));
  }

  /**
   * Returns the webElement the header element for bottom sheet
   * Uses the `BOTTOM_SHEET_HEADER` selector
   */
  get header() {
    return this.element.$(`~${BOTTOM_SHEET_HEADER}`);
  }

  /**
   * Returns the headerTitle of bottom sheet
   * Uses the `HEADER_TITLE` selector
   */
  get headerTitle() {
    return this.element.$(`~${BOTTOM_SHEET_HEADER_TITLE}`);
  }

  /**
   * Returns the headerCloseButton of bottom sheet
   * Uses the `CLOSE_BUTTON` selector
   */
  get headerCloseButton() {
    return this.element.$(`~${BOTTOM_SHEET_CLOSE_BUTTON}`);
  }

  /**
   * Returns the webview of bottom sheet
   * Uses the `LOYALTY_BOTTOM_SHEET_WEBVIEW` selector
   */
  get webview() {
    return this.element.$(`~${BOTTOM_SHEET_WEBVIEW}`);
  }
}

module.exports = LoyaltyBottomSheetSO;
