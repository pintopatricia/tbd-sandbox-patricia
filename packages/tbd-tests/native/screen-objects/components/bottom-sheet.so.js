const {
  BOTTOM_SHEET,
  CONTENT,
  HEADER_TITLE,
  HEADER_BUTTON,
  BOTTOM_SHEET_HEADER,
  HEADER_CONTENT,
  FOOTER_CONTENT,
} = require("@ppb/the-wall-native/components/BottomSheet/BottomSheet.selectors");

const { ACTION_BUTTON } = require("@ppb/the-wall-native/components/ActionButton/ActionButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BottomSheetSO extends BaseSO {
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
    return this.element.$(`~${HEADER_TITLE}`);
  }

  /**
   * Returns the headerButton of bottom sheet
   * Uses the `HEADER_BUTTON` selector
   */
  get headerButton() {
    return this.element.$(`~${HEADER_BUTTON}`);
  }

  /**
   * Returns the headerContent of bottom sheet
   * Uses the `HEADER_CONTENT` selector
   */
  get headerContent() {
    return this.element.$(`~${HEADER_CONTENT}`);
  }

  /**
   * Returns the content of bottom sheet
   * Uses the `CONTENT` selector
   */
  get content() {
    return this.element.$(`~${CONTENT}`);
  }

  /**
   * Returns the cashout button of bottom sheet
   * Uses the `ACTION_BUTTON` selector
   */
  get cashoutButton() {
    return this.element.$(`~${ACTION_BUTTON}`);
  }

  /**
   * Returns the footerContent of bottom sheet
   * Uses the `FOOTER_CONTENT` selector
   */
  get footerContent() {
    return this.element.$(`~${FOOTER_CONTENT}`);
  }

  /**
   * Dismisses the bottom sheet
   * Uses the headerButton to dismiss the bottom sheet
   */
  async dismiss() {
    await browser.waitUntilClickableNative(this.headerButton, "Bottom sheet header button is not clickable");
    await this.headerButton.click();
    await browser.waitUntilNotDisplayed(this.element, "Bottom sheet is still displayed after attempting to dismiss");
  }
}

module.exports = BottomSheetSO;
