const {
  TEST_ID: BOTTOM_SHEET,
  HEADER_CONTENT,
  FOOTER_CONTENT,
  CONTENT,
  CLOSE_BUTTON,
  HEADER,
} = require("@ppb/the-wall-web/components/walls/BottomSheet/BottomSheet.selectors");
const { TEST_ID: ALERT } = require("@ppb/the-wall-web/components/bricks/Alert/Alert.selectors");

const { PRIMARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/PrimaryButton/PrimaryButton.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

class GenerosityWalletPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(BOTTOM_SHEET));
  }

  get content() {
    return this.element.$(CONTENT);
  }

  get headerContent() {
    return this.element.$(HEADER_CONTENT);
  }

  get footerContent() {
    return this.element.$(FOOTER_CONTENT);
  }

  get headerTitle() {
    return this.element.$(HEADER);
  }

  get closeButton() {
    return this.element.$(CLOSE_BUTTON);
  }

  get applyButton() {
    return this.footerContent.$(PRIMARY_BUTTON);
  }

  get footerAlert() {
    return this.footerContent.$(ALERT);
  }
}

module.exports = GenerosityWalletPO;
