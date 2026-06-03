const {
  TEST_ID,
  HEADER,
  CLOSE_BUTTON,
  HEADER_CONTENT,
  CONTENT,
  FOOTER_CONTENT,
} = require("@ppb/the-wall-web/components/walls/BottomSheet/BottomSheet.selectors");
const {
  TEST_ID: REGULATORY,
} = require("@ppb/tbd-shared/components/MyBetsExchangeBottomSheet/MyBetsExchangeBottomSheet.web.selectors.js");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BottomSheetPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the webElement of the root element for bottom sheet
   * Uses the `TEST_ID` selector
   */
  get root() {
    return this.element.$(TEST_ID);
  }

  /**
   * Returns the webElement of the title for bottom sheet container
   * Uses the `HEADER` selector
   */
  get headerTitle() {
    return this.element.$(HEADER);
  }

  /**
   * Returns the webElement of the header content for bottom sheet container
   * Uses the `HEADER_CONTENT` selector
   */
  get headerContent() {
    return this.element.$(HEADER_CONTENT);
  }

  /**
   * Returns the webElement of the Close button element for bottom sheet container
   * Uses the `CLOSE_BUTTON` selector
   */
  get closeButton() {
    return this.element.$(CLOSE_BUTTON);
  }

  /**
   * Returns the webElement of the Content element for bottom sheet container
   * Uses the `CONTENT` selector
   */
  get content() {
    return this.element.$(CONTENT);
  }

  /**
   * Returns the webElement of the footer content for bottom sheet container
   * Uses the `FOOTER_CONTENT` selector
   */
  get footerContent() {
    return this.element.$(FOOTER_CONTENT);
  }

  /**
   * Returns the regulatory element
   * Uses the `REGULATORY` selector
   */
  get regulatory() {
    return this.element.$(REGULATORY);
  }
}

module.exports = BottomSheetPO;
